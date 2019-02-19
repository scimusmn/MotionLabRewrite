{
  "targets": [
    {
      "target_name": "vieworks",
      "sources": [
        "./local/VieworksModule/inits.cc",
        "./local/VieworksModule/vieworks.cc",
        "./local/VieworksModule/imgBuffer.cpp",
      ],
      "libraries": [
        "/usr/lib/x86_64-linux-gnu/libfreeimage.so.3",
        "/usr/lib/libVwGigE.so",
        "/usr/lib/libVwTli.so",
        "/opt/genicam2.3.1/bin/Linux64_x64/liblog4cpp_gcc40_v2_3.so",
        "/opt/genicam2.3.1/bin/Linux64_x64/libGenApi_gcc40_v2_3.so",
        "/opt/genicam2.3.1/bin/Linux64_x64/libGCBase_gcc40_v2_3.so",
        "/usr/lib/x86_64-linux-gnu/libQtCore.so.4"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "vendor/ubuntu/FreeImage/include",
        "/usr/include/VIS-Shadow",
        "/opt/genicam2.3.1/library/CPP/include",
        "/usr/include/qt4",
        "./local/VieworksModule/"
      ],
      "library_dirs": [
        "../vendor/ubuntu/FreeImage/lib",
        "../vendor/ubuntu/vieworks/lib/x64"
      ],
      'cflags_cc!': ['-fno-rtti'],
      'cflags_cc': ['-fexceptions'],
    }
  ]
}
