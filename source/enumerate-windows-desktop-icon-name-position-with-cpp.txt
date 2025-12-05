/*
 * With ref from
 *     Main code: https://stackoverflow.com/questions/4892491/how-to-get-names-of-the-icons-on-desktop
 *     Printing issues: https://blog.csdn.net/qq_42679415/article/details/147113191
 */

#define _CRT_SECURE_NO_WARNINGS

#include <stdlib.h>
#include <stdio.h>
#include <locale.h>
#include <fcntl.h>
#include <io.h>

#include <windows.h>
#include <shlobj.h>
#include <atlbase.h>

// Class to help with object destruction
// https://devblogs.microsoft.com/oldnewthing/20040520-00/?p=39243
class CCoInitialize {
public:
    CCoInitialize() : m_hr(CoInitialize(NULL)) { 
    
    }
    
    ~CCoInitialize() { 
        if (SUCCEEDED(m_hr)) {
            CoUninitialize();
        }
    }
    
    operator HRESULT() const { 
        return m_hr; 
    }
    
    HRESULT m_hr;
};

// Replace specified string in a wchat_t string
// https://zhuanlan.zhihu.com/p/364035600
wchar_t * wcsreplace(wchar_t * str, wchar_t * oldstr, wchar_t * newstr) {

    wchar_t * bstr = new wchar_t[wcslen(str)];
    memset(bstr, 0, sizeof(bstr));

    for (int i = 0; i < wcslen(str); ++i) {
        if (!wcsncmp(str + i, oldstr, wcslen(oldstr))) {
            wcscat(bstr, newstr);
            i += wcslen(oldstr) - 1;
        }
        else {
            wcsncat(bstr, str + i, 1);
        }
    }

    wcscpy(str, bstr);
    delete bstr;

    return str;

}

// Get shell view for the desktop
// https://devblogs.microsoft.com/oldnewthing/20130318-00/?p=4933
void FindDesktopFolderView(REFIID riid, void** ppv) {
    CComPtr<IShellWindows> spShellWindows;
    spShellWindows.CoCreateInstance(CLSID_ShellWindows);

    CComVariant vtLoc(CSIDL_DESKTOP);
    CComVariant vtEmpty;
    long lhwnd;
    CComPtr<IDispatch> spdisp;
    spShellWindows->FindWindowSW(
        &vtLoc, &vtEmpty,
        SWC_DESKTOP, &lhwnd, SWFO_NEEDDISPATCH, &spdisp);

    CComPtr<IShellBrowser> spBrowser;
    CComQIPtr<IServiceProvider>(spdisp)->
        QueryService(SID_STopLevelBrowser,
            IID_PPV_ARGS(&spBrowser));

    CComPtr<IShellView> spView;
    spBrowser->QueryActiveShellView(&spView);

    spView->QueryInterface(riid, ppv);
}



int main(int argc, char *argv[]) {
    // Fix text print
    setlocale(LC_CTYPE, "");

    // Open output file as UTF-8
    bool bIsOutputFileReady = false;
    FILE * fpOutputFile = NULL;
    if (argc > 1) {
        // Convert argument in char* to wchar_t*
        // https://blog.csdn.net/jeanphorn/article/details/45745739
        int iOutputPathLen = strlen(argv[1]) + 1;
        wchar_t * spszOutputFile = new wchar_t[iOutputPathLen];
        swprintf(spszOutputFile, iOutputPathLen, L"%hs", argv[1]);

        // Open file as UTF-8
        // https://stackoverflow.com/questions/10028750
        fpOutputFile = _wfopen(spszOutputFile, L"w");
        if (!(fpOutputFile == NULL)) {
            _setmode(_fileno(fpOutputFile), _O_U8TEXT);
            bIsOutputFileReady = true;
        }
    }
    
    // Get FolderView of Desktop
    CCoInitialize init;
    CComPtr<IFolderView> spView;
    FindDesktopFolderView(IID_PPV_ARGS(&spView));
    CComPtr<IShellFolder> spFolder;
    spView->GetFolder(IID_PPV_ARGS(&spFolder));

    // Enumerate child windows (icons)
    CComPtr<IEnumIDList> spEnum;
    spView->Items(SVGIO_ALLVIEW, IID_PPV_ARGS(&spEnum));

    // Check if there are any icons present in Desktop
    int nItemCount = 0;
    spView->ItemCount(SVGIO_ALLVIEW, &nItemCount);
    printf("%d\n", nItemCount);
    if (bIsOutputFileReady) {
        fwprintf(fpOutputFile, L"[General]\n");
        fwprintf(fpOutputFile, L"ItemCount=%d\n", nItemCount);
        fwprintf(fpOutputFile, L"\n");
    }
    if (nItemCount < 1) {
        fclose(fpOutputFile);
        return 0;
    }

    // Iterate through desktop icons
    int iItemID = 0;
    for (CComHeapPtr<ITEMID_CHILD> spidl;
        spEnum->Next(1, &spidl, nullptr) == S_OK;
        spidl.Free()) {

        // Get display name
        STRRET strName;
        spFolder->GetDisplayNameOf(spidl, SHGDN_NORMAL, &strName);
        CComHeapPtr<wchar_t> spszName;
        StrRetToStr(&strName, spidl, &spszName);

        // Get Address Bar text
        STRRET strAddressBarData;
        spFolder->GetDisplayNameOf(spidl, SHGDN_FORADDRESSBAR, &strAddressBarData);
        CComHeapPtr<wchar_t> spszAddressBarData;
        StrRetToStr(&strAddressBarData, spidl, &spszAddressBarData);

        // Get text for parsing
        STRRET strParsingData;
        spFolder->GetDisplayNameOf(spidl, SHGDN_FORPARSING, &strParsingData);
        CComHeapPtr<wchar_t> spszPath;
        StrRetToStr(&strParsingData, spidl, &spszPath);

        // Print to console
        POINT pt;
        spView->GetItemPosition(spidl, &pt);
        printf("%d %d\n", pt.x, pt.y);
        printf("%ls\n", spszName);

        // Write to output file
        if (bIsOutputFileReady) {
            fwprintf(fpOutputFile, L"[Item%d]\n", iItemID);
            fwprintf(fpOutputFile, L"Name=%ls\n", wcsreplace(spszName, L"\\", L"\\\\"));
            fwprintf(fpOutputFile, L"Address=%ls\n", wcsreplace(spszAddressBarData, L"\\", L"\\\\"));
            fwprintf(fpOutputFile, L"Path=%ls\n", wcsreplace(spszPath, L"\\", L"\\\\"));
            fwprintf(fpOutputFile, L"X=%d\n", pt.x);
            fwprintf(fpOutputFile, L"Y=%d\n", pt.y);
            fwprintf(fpOutputFile, L"\n");
        }
        ++iItemID;
    }
    fclose(fpOutputFile);
    return 0;
}