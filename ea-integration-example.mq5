//+------------------------------------------------------------------+
//|                                EA License Integration Example    |
//|                                Copyright 2025, AlgoTrading      |
//|                                https://algotrading.com           |
//+------------------------------------------------------------------+
#property copyright "Copyright 2025, AlgoTrading"
#property link      "https://algotrading.com"
#property version   "1.00"

// License validation parameters
input string LicenseKey = "XXXX-XXXX-XXXX-XXXX"; // Your license key
input string EAProductCode = "CRYPTO_PULSE"; // EA product code
input int ValidationIntervalMinutes = 5; // Validation check interval

// Global variables
datetime LastValidationTime = 0;
string SessionToken = "";
bool LicenseValid = false;
string ApiBaseUrl = "https://vvgtmfmvisxhivmldrhd.supabase.co/functions/v1/";

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
    // Validate license on startup
    if(!ValidateLicense())
    {
        Print("❌ License validation failed - EA will not trade");
        return INIT_FAILED;
    }
    
    Print("✅ License validated successfully");
    return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    // Clean up session on exit
    if(SessionToken != "")
    {
        // Optionally notify server of session end
        Print("EA shutting down - Session ended");
    }
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
    // Check license validity periodically
    if(TimeCurrent() - LastValidationTime > ValidationIntervalMinutes * 60)
    {
        if(!SendHeartbeat())
        {
            Print("❌ License heartbeat failed - stopping EA");
            LicenseValid = false;
            return;
        }
        LastValidationTime = TimeCurrent();
    }
    
    // Only trade if license is valid
    if(!LicenseValid)
    {
        Print("⚠️ License invalid - trading disabled");
        return;
    }
    
    // Your EA trading logic goes here
    ExecuteTradingLogic();
}

//+------------------------------------------------------------------+
//| License validation function                                     |
//+------------------------------------------------------------------+
bool ValidateLicense()
{
    string url = ApiBaseUrl + "validate-license";
    string headers = "Content-Type: application/json\r\n";
    
    // Generate hardware fingerprint
    string hardwareInfo = GenerateHardwareFingerprint();
    
    // Create validation request
    string postData = StringFormat(
        "{\"license_key\":\"%s\",\"hardware_info\":%s,\"mt5_account\":\"%d\",\"ea_product_code\":\"%s\",\"ea_instance_id\":\"%s\"}",
        LicenseKey,
        hardwareInfo,
        AccountInfoInteger(ACCOUNT_LOGIN),
        EAProductCode,
        GenerateEAInstanceId()
    );
    
    char post[], result[];
    StringToCharArray(postData, post, 0, StringLen(postData));
    
    int timeout = 10000; // 10 seconds
    int res = WebRequest("POST", url, headers, timeout, post, result, headers);
    
    if(res == -1)
    {
        Print("❌ License validation request failed: ", GetLastError());
        return false;
    }
    
    string response = CharArrayToString(result);
    Print("License validation response: ", response);
    
    // Parse JSON response (simplified - use proper JSON parser in production)
    if(StringFind(response, "\"valid\":true") >= 0)
    {
        // Extract session token
        int tokenStart = StringFind(response, "\"session_token\":\"") + 17;
        int tokenEnd = StringFind(response, "\"", tokenStart);
        if(tokenStart > 16 && tokenEnd > tokenStart)
        {
            SessionToken = StringSubstr(response, tokenStart, tokenEnd - tokenStart);
        }
        
        LicenseValid = true;
        LastValidationTime = TimeCurrent();
        return true;
    }
    
    // Parse error message
    int errorStart = StringFind(response, "\"error\":\"") + 9;
    int errorEnd = StringFind(response, "\"", errorStart);
    if(errorStart > 8 && errorEnd > errorStart)
    {
        string errorMsg = StringSubstr(response, errorStart, errorEnd - errorStart);
        Print("❌ License validation error: ", errorMsg);
    }
    
    return false;
}

//+------------------------------------------------------------------+
//| Send heartbeat to maintain license session                      |
//+------------------------------------------------------------------+
bool SendHeartbeat()
{
    if(SessionToken == "")
    {
        return ValidateLicense(); // Re-validate if no session
    }
    
    string url = ApiBaseUrl + "heartbeat-license";
    string headers = "Content-Type: application/json\r\n";
    
    string postData = StringFormat(
        "{\"session_token\":\"%s\",\"ea_instance_id\":\"%s\"}",
        SessionToken,
        GenerateEAInstanceId()
    );
    
    char post[], result[];
    StringToCharArray(postData, post, 0, StringLen(postData));
    
    int timeout = 10000;
    int res = WebRequest("POST", url, headers, timeout, post, result, headers);
    
    if(res == -1)
    {
        Print("❌ Heartbeat request failed: ", GetLastError());
        return false;
    }
    
    string response = CharArrayToString(result);
    
    if(StringFind(response, "\"success\":true") >= 0)
    {
        return true;
    }
    
    // Check if we need to terminate
    if(StringFind(response, "\"action\":\"terminate\"") >= 0)
    {
        Print("❌ License terminated by server");
        SessionToken = "";
        LicenseValid = false;
        return false;
    }
    
    return false;
}

//+------------------------------------------------------------------+
//| Generate hardware fingerprint for license binding              |
//+------------------------------------------------------------------+
string GenerateHardwareFingerprint()
{
    // This is a simplified version - implement more sophisticated fingerprinting
    string fingerprint = StringFormat(
        "{\"cpu_id\":\"%s\",\"system_uuid\":\"%s\",\"mac_address\":\"%s\"}",
        "CPU_" + IntegerToString(GetTickCount()), // Simplified CPU ID
        "SYS_" + IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)), // Use account as system identifier
        "MAC_" + IntegerToString(TerminalInfoString(TERMINAL_COMPANY) != "" ? StringLen(TerminalInfoString(TERMINAL_COMPANY)) : 12345)
    );
    return fingerprint;
}

//+------------------------------------------------------------------+
//| Generate unique EA instance ID                                  |
//+------------------------------------------------------------------+
string GenerateEAInstanceId()
{
    return StringFormat("%s_%d_%s", 
        EAProductCode, 
        AccountInfoInteger(ACCOUNT_LOGIN),
        Symbol()
    );
}

//+------------------------------------------------------------------+
//| Your main trading logic goes here                              |
//+------------------------------------------------------------------+
void ExecuteTradingLogic()
{
    // This is where you implement your EA's trading strategy
    // Example:
    /*
    if(SomeCondition())
    {
        // Open buy position
        int ticket = OrderSend(Symbol(), OP_BUY, 0.1, Ask, 3, 0, 0, "EA Trade", 0, 0, clrGreen);
        if(ticket > 0)
        {
            Print("✅ Buy order opened: ", ticket);
        }
    }
    */
    
    // For demo purposes, just print a message
    static datetime lastPrint = 0;
    if(TimeCurrent() - lastPrint > 60) // Print once per minute
    {
        Print("🔄 EA is running with valid license - ", TimeToString(TimeCurrent()));
        lastPrint = TimeCurrent();
    }
}