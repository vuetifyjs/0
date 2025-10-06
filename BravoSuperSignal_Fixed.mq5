//+------------------------------------------------------------------+
//|                                             BravoSuperSignal.mq5 |
//|                                                                . |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property indicator_chart_window
#property indicator_buffers 3
#property indicator_color1 Red
#property indicator_color2 White
#property indicator_color3 Black

#define FLINESIZE 14

//TimeFrame, RsiPeriod, MaType, MaPeriod
input string TimeFrame = "240";
input int SignalLength = 4;
input int ActingSensitivity = 1;        // 0=SMA,1=EMA,2=SMMA,3=LWMA
input int SensitivityStrength = 3;
input bool Interpolate = true;
input string arrowsIdentifier = "BravoSuperSignal arrows";
input color arrowsUpColor = clrLime;
input color arrowsDnColor = clrRed;
input bool alertsOn = false;
input bool alertsSound = false;
input bool alertsOnCurrent = false;
input bool alertsMessage = false;
input bool alertsEmail = false;

double SignalLineUP[];
double SignalLineDown[];
double Trend[];

string ExpertName;
bool tf01 = false;
bool tf02 = false;
int gettimeframe;
string Donothing = "nothing";
datetime CurrentTime;
datetime lastArrTime = 0;

string ErrorStr = "";
string WorckFileName = "indti_snbr2_save2_";
int hFile = INVALID_HANDLE;

// sub-indicator handles
int handleReturnBars = INVALID_HANDLE;
int handleCalc = INVALID_HANDLE;

// --------------------- MA-on-array helpers (MT5 replacement for iMAOnArray) ---------------------
double SMA_on_series(const double &a[], int i, int period, int total)
{
	int cnt = 0; double sum = 0.0;
	for (int k = 0; k < period && (i + k) < total; k++) { sum += a[i + k]; cnt++; }
	return (cnt > 0 ? sum / cnt : a[i]);
}

double LWMA_on_series(const double &a[], int i, int period, int total)
{
	int wsum = 0; double sum = 0.0;
	for (int k = 0; k < period && (i + k) < total; k++) { int w = period - k; sum += a[i + k] * w; wsum += w; }
	return (wsum > 0 ? sum / wsum : a[i]);
}

void EMA_fill_series(const double &src[], double &dst[], int total, int period)
{
	if (period <= 1 || total <= 0) { for (int i = 0; i < total; i++) dst[i] = src[i]; return; }
	double alpha = 2.0 / (period + 1.0);
	int seed = MathMax(0, total - period);
	double ema = SMA_on_series(src, seed, period, total);
	for (int i = seed - 1; i >= 0; i--) { ema = alpha * src[i] + (1.0 - alpha) * ema; dst[i] = ema; }
	for (int i = total - 1; i >= seed; i--) dst[i] = SMA_on_series(src, i, period, total);
}

void SMMA_fill_series(const double &src[], double &dst[], int total, int period)
{
	if (period <= 1 || total <= 0) { for (int i = 0; i < total; i++) dst[i] = src[i]; return; }
	int seed = MathMax(0, total - period);
	double smma = SMA_on_series(src, seed, period, total);
	for (int i = seed - 1; i >= 0; i--) { smma = (smma * (period - 1) + src[i]) / period; dst[i] = smma; }
	for (int i = total - 1; i >= seed; i--) dst[i] = SMA_on_series(src, i, period, total);
}

void MA_on_array_series(const double &src[], double &dst[], int total, int period, int ma_method)
{
	switch (ma_method)
	{
	case 0: // MODE_SMA
		for (int i = 0; i < total; i++) dst[i] = SMA_on_series(src, i, period, total);
		break;
	case 1: // MODE_EMA
		EMA_fill_series(src, dst, total, period);
		break;
	case 2: // MODE_SMMA (Wilder)
		SMMA_fill_series(src, dst, total, period);
		break;
	case 3: // MODE_LWMA
		for (int i = 0; i < total; i++) dst[i] = LWMA_on_series(src, i, period, total);
		break;
	default:
		for (int i = 0; i < total; i++) dst[i] = SMA_on_series(src, i, period, total);
	}
}

//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
int OnInit()
{
	IndicatorSetString(INDICATOR_SHORTNAME, "BravoSuperSignal");

	SetIndexBuffer(0, SignalLineUP);
	PlotIndexSetString(0, PLOT_LABEL, "");
	PlotIndexSetInteger(0, PLOT_LINE_COLOR, clrLime);

	SetIndexBuffer(1, SignalLineDown);
	PlotIndexSetString(1, PLOT_LABEL, "");
	PlotIndexSetInteger(1, PLOT_LINE_COLOR, clrRed);

	SetIndexBuffer(2, Trend);
	PlotIndexSetString(2, PLOT_LABEL, "");

	if (TimeFrame == "calculate")
	{
		tf01 = true;
		return(0);
	}

	if (TimeFrame == "returnBars")
	{
		tf02 = true;
		return(0);
	}

	gettimeframe = f0_0(TimeFrame);
	ExpertName = MQLInfoString(MQL_PROGRAM_NAME);

	StartFile();

	return(0);
}

//+------------------------------------------------------------------+
//| Custom indicator deinitialization function                       |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
	f0_2();
	if (handleReturnBars != INVALID_HANDLE) { IndicatorRelease(handleReturnBars); handleReturnBars = INVALID_HANDLE; }
	if (handleCalc != INVALID_HANDLE) { IndicatorRelease(handleCalc); handleCalc = INVALID_HANDLE; }
}

//+------------------------------------------------------------------+
//| Custom indicator iteration function                              |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
	if (AccountInfoInteger(ACCOUNT_LOGIN) != 197848381)
	{
		Alert("Account Number Not Match");
		return(rates_total);
	}

	// EXPIRY
	string datestr = "2025.12.10";
	if (TimeCurrent() > StringToTime(datestr))
	{
		Alert("Time Expired");
		return(rates_total);
	}

	int shift_0;
	int datetime_4;
	double coeff;
	int Pos;

	int limit = rates_total - 1;  // Process all bars every time

	// returnBars mode
	if (tf02)
	{
		SignalLineUP[0] = (double)rates_total;
		return(rates_total);
	}

	// calculate mode (local math, no recursion)
	if (tf01)
	{
		int rsi_handle = iRSI(NULL, 0, SignalLength, PRICE_CLOSE);
		if (rsi_handle == INVALID_HANDLE) return(rates_total);

		// Fill RSI buffer for all bars
		if (CopyBuffer(rsi_handle, 0, 0, rates_total, SignalLineUP) <= 0)
			return(rates_total);

		// Use MA_on_array_series instead of iMAOnArray
		MA_on_array_series(SignalLineUP, SignalLineDown, rates_total, SensitivityStrength, ActingSensitivity);
		return(rates_total);
	}

	// consumer mode: use HTF instance via iCustom
	if (handleReturnBars == INVALID_HANDLE)
	{
		handleReturnBars = iCustom(
			NULL,
			(ENUM_TIMEFRAMES)gettimeframe,
			ExpertName,
			"returnBars",
			SignalLength,
			ActingSensitivity,
			SensitivityStrength,
			Interpolate,
			arrowsIdentifier,
			arrowsUpColor,
			arrowsDnColor,
			alertsOn,
			alertsSound,
			alertsOnCurrent,
			alertsMessage,
			alertsEmail
		);
	}

	if (handleCalc == INVALID_HANDLE)
	{
		handleCalc = iCustom(
			NULL,
			(ENUM_TIMEFRAMES)gettimeframe,
			ExpertName,
			"calculate",
			SignalLength,
			ActingSensitivity,
			SensitivityStrength,
			Interpolate,
			arrowsIdentifier,
			arrowsUpColor,
			arrowsDnColor,
			alertsOn,
			alertsSound,
			alertsOnCurrent,
			alertsMessage,
			alertsEmail
		);
	}

	if (handleCalc == INVALID_HANDLE) return(rates_total);

	// adjust limit using returnBars (if available) - Match MT4 logic
	if (gettimeframe > Period() && handleReturnBars != INVALID_HANDLE)
	{
		double bars_value[1];
		if (CopyBuffer(handleReturnBars, 0, 0, 1, bars_value) > 0)
		{
			int bars = (int)bars_value[0];
			limit = MathMax(limit, MathMin(rates_total - 1, bars * gettimeframe / Period()));
		}
	}

	int typeLastSignal = -1; // sentinel for "no signal yet"

	// Process ALL bars from limit down to 0 to get ALL historical signals - Match MT4 exactly
	for (int i = limit; i >= 0; i--)
	{
		shift_0 = iBarShift(NULL, (ENUM_TIMEFRAMES)gettimeframe, time[i]);
		if (shift_0 < 0) continue;

		double signal_up[1], signal_down[1];
		if (CopyBuffer(handleCalc, 0, shift_0, 1, signal_up) <= 0) break;   // buffer 0
		if (CopyBuffer(handleCalc, 1, shift_0, 1, signal_down) <= 0) break; // buffer 1

		SignalLineUP[i] = signal_up[0];
		SignalLineDown[i] = signal_down[0];

		// Match MT4 trend logic exactly
		if (i + 1 < rates_total) Trend[i] = Trend[i + 1];
		else Trend[i] = 0;

		if (SignalLineUP[i] > SignalLineDown[i]) Trend[i] = 1;
		if (SignalLineUP[i] < SignalLineDown[i]) Trend[i] = -1;

		// Draw arrows for ALL trend changes - Match MT4 logic exactly
		if (i + 1 < rates_total && Trend[i] != Trend[i + 1])
		{
			if (Trend[i] == 1.0)
			{
				DrawArrowForBar(i, arrowsUpColor, 108, 0, time, high, low);
				typeLastSignal = 0; // buy (OP_BUY equivalent)
			}
			if (Trend[i] == -1.0)
			{
				DrawArrowForBar(i, arrowsDnColor, 108, 1, time, high, low);
				typeLastSignal = 1; // sell (OP_SELL equivalent)
			}
		}

		// interpolate between HTF points - Match MT4 logic exactly
		if (gettimeframe <= Period() || i == 0 || shift_0 == iBarShift(NULL, (ENUM_TIMEFRAMES)gettimeframe, time[i - 1])) continue;

		if (Interpolate)
		{
			datetime_4 = (int)iTime(NULL, (ENUM_TIMEFRAMES)gettimeframe, shift_0);
			int jj = 1;
			while (i + jj < rates_total && time[i + jj] >= datetime_4)
				jj++;

			coeff = 1.0 / jj;
			for (int kk = 1; kk < jj; kk++)
			{
				if (i + jj >= rates_total) break;
				SignalLineUP[i + kk] = kk * coeff * SignalLineUP[i + jj] + (1.0 - kk * coeff) * SignalLineUP[i];
				SignalLineDown[i + kk] = kk * coeff * SignalLineDown[i + jj] + (1.0 - kk * coeff) * SignalLineDown[i];
			}
		}
	}

	// Match MT4 alerts logic exactly
	if (alertsOn)
	{
		Pos = alertsOnCurrent ? 0 : 1;

		if (Pos + 1 < rates_total && Trend[Pos] != Trend[Pos + 1])
		{
			if (Trend[Pos] == 1.0) f0_5("Trend UP");
			if (Trend[Pos] == -1.0) f0_5("Trend DOWN");
		}
	}

	// Match MT4 signal saving logic exactly
	datetime curTime = iTime(NULL, (ENUM_TIMEFRAMES)gettimeframe, 0);
	string nameCurObj = arrowsIdentifier + ":" + (string)iTime(NULL, (ENUM_TIMEFRAMES)gettimeframe, 0);

	// Only save once per new HTF bar
	if (ObjectFind(0, nameCurObj) == -1 && curTime > lastArrTime)
	{
		if (typeLastSignal != -1)
		{
			if (lastArrTime == 0)
				SaveSignal(curTime, typeLastSignal);
			else
			{
				datetime minuts = iTime(NULL, PERIOD_M1, 0);
				SaveSignal(curTime, typeLastSignal, minuts);

				if (Period() < gettimeframe)
					if (typeLastSignal == 0)
						DrawArrowForTime(minuts, arrowsUpColor, 233, true, high, low);
					else
						DrawArrowForTime(minuts, arrowsDnColor, 234, false, high, low);
			}
		}
		Print("Try save signal");
		lastArrTime = curTime;
	}

	if (lastArrTime == 0) lastArrTime = curTime - 1;

	return(rates_total);
}

//+------------------------------------------------------------------+
//| Draw arrow for bar - FIXED OBJECT CREATION                      |
//+------------------------------------------------------------------+
void DrawArrowForBar(int k, color color01, int ArrowType, bool DrawArrow01, const datetime &time[], const double &high[], const double &low[])
{
	string arrowname = arrowsIdentifier + ":" + (string)time[k];

	// Check if arrow already exists
	if (ObjectFind(0, arrowname) >= 0) return;

	// Get ATR value - Match MT4 logic exactly
	int atr_handle = iATR(NULL, 0, 20);
	double atr_values[1];
	if (CopyBuffer(atr_handle, 0, k, 1, atr_values) <= 0)
		return;

	double Atr_01 = 3.0 * atr_values[0] / 4.0;

	// Create arrow object
	if (!ObjectCreate(0, arrowname, OBJ_ARROW, 0, time[k], 0))
		return;

	ObjectSetInteger(0, arrowname, OBJPROP_ARROWCODE, ArrowType);
	ObjectSetInteger(0, arrowname, OBJPROP_COLOR, color01);
	ObjectSetInteger(0, arrowname, OBJPROP_WIDTH, 2);
	ObjectSetInteger(0, arrowname, OBJPROP_BACK, false);
	ObjectSetInteger(0, arrowname, OBJPROP_SELECTABLE, false);
	ObjectSetInteger(0, arrowname, OBJPROP_HIDDEN, true);
	ObjectSetInteger(0, arrowname, OBJPROP_ZORDER, 0);

	// Set price - Match MT4 positioning exactly
	if (DrawArrow01)
	{
		ObjectSetDouble(0, arrowname, OBJPROP_PRICE, high[k] + Atr_01);
		return;
	}
	ObjectSetDouble(0, arrowname, OBJPROP_PRICE, low[k] - Atr_01);
}

//+------------------------------------------------------------------+
//| Draw arrow for time - FIXED OBJECT CREATION                     |
//+------------------------------------------------------------------+
void DrawArrowForTime(datetime timeV, color color02, int arrowCode, bool DrawUp, const double &high[], const double &low[])
{
	int bar = iBarShift(NULL, 0, timeV);
	if (bar < 0) return;

	string arrowname = arrowsIdentifier + ":" + (string)timeV;

	// Check if arrow already exists
	if (ObjectFind(0, arrowname) >= 0) return;

	// Get ATR value - Match MT4 logic exactly
	int atr_handle = iATR(NULL, 0, 20);
	double atr_values[1];
	if (CopyBuffer(atr_handle, 0, bar, 1, atr_values) <= 0)
		return;

	double Atr_02 = 3.0 * atr_values[0] / 4.0;

	// Create arrow object
	if (!ObjectCreate(0, arrowname, OBJ_ARROW, 0, timeV, 0))
		return;

	ObjectSetInteger(0, arrowname, OBJPROP_ARROWCODE, arrowCode);
	ObjectSetInteger(0, arrowname, OBJPROP_COLOR, color02);
	ObjectSetInteger(0, arrowname, OBJPROP_WIDTH, 2);
	ObjectSetInteger(0, arrowname, OBJPROP_BACK, false);
	ObjectSetInteger(0, arrowname, OBJPROP_SELECTABLE, false);
	ObjectSetInteger(0, arrowname, OBJPROP_HIDDEN, true);
	ObjectSetInteger(0, arrowname, OBJPROP_ZORDER, 0);

	// Set price - Match MT4 positioning exactly
	if (DrawUp)
	{
		ObjectSetDouble(0, arrowname, OBJPROP_PRICE, high[bar] + Atr_02);
		return;
	}
	ObjectSetDouble(0, arrowname, OBJPROP_PRICE, low[bar] - Atr_02);
}

//+------------------------------------------------------------------+
//| Delete arrow objects                                            |
//+------------------------------------------------------------------+
void f0_2()
{
	string name_0;
	string ls_8 = arrowsIdentifier + ":";
	int str_len_16 = StringLen(ls_8);

	for (int Li_20 = ObjectsTotal(0) - 1; Li_20 >= 0; Li_20--)
	{
		name_0 = ObjectName(0, Li_20);
		if (StringSubstr(name_0, 0, str_len_16) == ls_8)
			ObjectDelete(0, name_0);
	}
}

//+------------------------------------------------------------------+
//| Delete arrow object by time                                     |
//+------------------------------------------------------------------+
void f0_4(int ai_0)
{
	string name_4 = arrowsIdentifier + ":" + (string)ai_0;
	ObjectDelete(0, name_4);
}

//+------------------------------------------------------------------+
//| Send alerts - Match MT4 logic exactly                          |
//+------------------------------------------------------------------+
void f0_5(string as_0)
{
	string str_concat_8;
	if (Donothing != as_0 || CurrentTime != TimeCurrent())
	{
		Donothing = as_0;
		CurrentTime = TimeCurrent();
		str_concat_8 = Symbol() + " at " + TimeToString(TimeLocal(), TIME_SECONDS) + " Signal Arrow " + as_0;

		if (alertsMessage) Alert(str_concat_8);
		if (alertsEmail) SendMail(Symbol() + " Signal Arrow", str_concat_8);
		if (alertsSound) PlaySound("alert2.wav");
	}
}

//+------------------------------------------------------------------+
//| Convert timeframe string to number                              |
//+------------------------------------------------------------------+
int f0_0(string as_0)
{
	int Li_8;
	for (int Li_12 = StringLen(as_0) - 1; Li_12 >= 0; Li_12--)
	{
		Li_8 = StringGetCharacter(as_0, Li_12);
		if ((Li_8 > (int)'`' && Li_8 < (int)'{') || (Li_8 > (int)'?' && Li_8 < 256))
		{
			StringSetCharacter(as_0, Li_12, (ushort)(Li_8 - 32));
		}
		else if (Li_8 > -33 && Li_8 < 0)
		{
			StringSetCharacter(as_0, Li_12, (ushort)(Li_8 + 224));
		}
	}

	int timeframe_16 = 0;
	if (as_0 == "M1" || as_0 == "1")
		timeframe_16 = 1;
	else if (as_0 == "M5" || as_0 == "5")
		timeframe_16 = 5;
	else if (as_0 == "M15" || as_0 == "15")
		timeframe_16 = 15;
	else if (as_0 == "M30" || as_0 == "30")
		timeframe_16 = 30;
	else if (as_0 == "H1" || as_0 == "60")
		timeframe_16 = 60;
	else if (as_0 == "H4" || as_0 == "240")
		timeframe_16 = 240;
	else if (as_0 == "D1" || as_0 == "1440")
		timeframe_16 = 1440;
	else if (as_0 == "W1" || as_0 == "10080")
		timeframe_16 = 10080;
	else if (as_0 == "MN" || as_0 == "43200")
		timeframe_16 = 43200;

	if (timeframe_16 == 0 || timeframe_16 < Period())
		timeframe_16 = Period();

	return(timeframe_16);
}

//+------------------------------------------------------------------+
//| Convert timeframe number to string                              |
//+------------------------------------------------------------------+
string f0_3()
{
	switch (gettimeframe)
	{
	case 1:
		return("M(1)");
	case 5:
		return("M(5)");
	case 15:
		return("M(15)");
	case 30:
		return("M(30)");
	case 60:
		return("H(1)");
	case 240:
		return("H(4)");
	case 1440:
		return("D(1)");
	case 10080:
		return("W(1)");
	case 43200:
		return("MN(1)");
	}
	return("Unknown timeframe");
}

//+------------------------------------------------------------------+
//| Start file reading - FIXED FILE READING LOGIC                   |
//+------------------------------------------------------------------+
void StartFile()
{
	WorckFileName = WorckFileName + Symbol() + (string)gettimeframe + "_" + (string)SignalLength + "_" + (string)ActingSensitivity + "_" + (string)SensitivityStrength + "_" + (string)Interpolate + ".csv";

	hFile = FileOpen(WorckFileName, FILE_READ | FILE_WRITE | FILE_CSV | FILE_SHARE_READ | FILE_SHARE_WRITE);

	if (hFile == INVALID_HANDLE)
	{
		ErrorStr = WorckFileName + ", error " + (string)GetLastError();
		Print(ErrorStr);
		Comment(MQLInfoString(MQL_PROGRAM_NAME) + " " + ErrorStr);
		hFile = INVALID_HANDLE;
		return;
	}

	lastArrTime = 0;
	datetime timeV;
	int op;
	int counter = 0;

	FileSeek(hFile, 0, SEEK_SET);

	while (!FileIsEnding(hFile))
	{
		if (FileIsEnding(hFile)) break;

		timeV = (datetime)FileReadNumber(hFile);
		if (FileIsEnding(hFile)) break;

		op = (int)FileReadNumber(hFile);

		// Try consume end-of-line if present
		if (!FileIsEnding(hFile))
		{
			string line = FileReadString(hFile);
			if (StringLen(line) == 0 && FileIsEnding(hFile)) break;
		}

		if (timeV > 0)
		{
			if (op == 0) // OP_BUY equivalent
			{
				DrawArrowForTimeSimple(timeV, arrowsUpColor, 233, true);
				Alert("Buy ", Symbol(), " M", Period(), " positive trend ");
			}

			if (op == 1) // OP_SELL equivalent
			{
				DrawArrowForTimeSimple(timeV, arrowsDnColor, 234, false);
				Alert("Sell", Symbol(), " M", Period(), " negative trend");
			}

			if (timeV > lastArrTime) lastArrTime = timeV;
			counter++;
		}
	}

	Print("Counter: ", counter);
	FileClose(hFile);
}

//+------------------------------------------------------------------+
//| Draw arrow for time (without arrays) - FIXED OBJECT CREATION    |
//+------------------------------------------------------------------+
void DrawArrowForTimeSimple(datetime timeV, color color02, int arrowCode, bool DrawUp)
{
	string arrowname = arrowsIdentifier + ":" + (string)timeV;

	// Check if arrow already exists
	if (ObjectFind(0, arrowname) >= 0) return;

	int bar = iBarShift(NULL, 0, timeV);
	if (bar < 0) return;

	// Get ATR value - Match MT4 logic exactly
	int atr_handle = iATR(NULL, 0, 20);
	double atr_values[1];
	if (CopyBuffer(atr_handle, 0, bar, 1, atr_values) <= 0)
		return;

	double Atr_02 = 3.0 * atr_values[0] / 4.0;

	// Create arrow object
	if (!ObjectCreate(0, arrowname, OBJ_ARROW, 0, timeV, 0))
		return;

	ObjectSetInteger(0, arrowname, OBJPROP_ARROWCODE, arrowCode);
	ObjectSetInteger(0, arrowname, OBJPROP_COLOR, color02);
	ObjectSetInteger(0, arrowname, OBJPROP_WIDTH, 2);
	ObjectSetInteger(0, arrowname, OBJPROP_BACK, false);
	ObjectSetInteger(0, arrowname, OBJPROP_SELECTABLE, false);
	ObjectSetInteger(0, arrowname, OBJPROP_HIDDEN, true);
	ObjectSetInteger(0, arrowname, OBJPROP_ZORDER, 0);

	// Set price - place relative to historical bar
	double price = (DrawUp ? iHigh(NULL, 0, bar) + Atr_02 : iLow(NULL, 0, bar) - Atr_02);
	ObjectSetDouble(0, arrowname, OBJPROP_PRICE, price);
}

//+------------------------------------------------------------------+
//| Save signal to file - FIXED FILE WRITING                       |
//+------------------------------------------------------------------+
void SaveSignal(datetime timeV, int op, datetime time2 = 0)
{
	hFile = FileOpen(WorckFileName, FILE_READ | FILE_WRITE | FILE_CSV | FILE_SHARE_READ | FILE_SHARE_WRITE);

	if (hFile == INVALID_HANDLE)
	{
		ErrorStr = WorckFileName + ", error " + (string)GetLastError();
		Print(ErrorStr);
		Comment(MQLInfoString(MQL_PROGRAM_NAME) + " " + ErrorStr);
		hFile = INVALID_HANDLE;
		return;
	}

	bool needWrite = false;

	// Match MT4 file writing logic exactly
	if (FileIsEnding(hFile))
		needWrite = true;
	else if (FileSeek(hFile, -FLINESIZE, SEEK_END))
	{
		datetime timeLastSignal = (datetime)FileReadNumber(hFile);

		if (timeLastSignal < timeV || (time2 != 0 && timeLastSignal < time2))
			needWrite = true;
	}

	if (needWrite)
	{
		if (FileSeek(hFile, 0, SEEK_END))
		{
			if (FileWrite(hFile, timeV, op) == 0)
				Print(" ", WorckFileName);

			if (time2 != 0)
				if (FileWrite(hFile, time2, op) == 0)
					Print("", WorckFileName);
		}
	}

	FileClose(hFile);
}