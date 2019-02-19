#ifndef VWCAM_H
#define VWCAM_H

#define LOG4CPP_FIX_ERROR_COLLISION 1

#include <nan.h>

#include <iostream>

#include "imgBuffer.h"

// for VwGigE
#include "VwGigE.h"
#include "VwGigE.API.h"
#include "VwCamera.h"
#include "VwImageProcess.h"
#include "PixelFormat/ipixelformat.h"
#include <QtCore/QMutexLocker>
#include <QtCore/QThread>
#include <QtCore/QCoreApplication>

//#include "VwGigE.API.h"

using namespace v8;
using namespace PixelFormat;

#include "FreeImage.h"

class vwCam : public Nan::ObjectWrap {

 public:
  static void Init(v8::Local<v8::Object> exports);
  void setDefaults();
  void allocate();
  void store(IMAGE_INFO* pImageInfo);
  void open();

 private:
   imgBuffer *buffer;
   VWGIGE_HANDLE GigE;
   HCAMERA camera;
   HCAMERA * pCam;
   BITMAPINFO* BmpInfo1;
   IPixelFormat* piPixelFormat;
	 UINT imageBufferNumber;
	 OBJECT_INFO* objectInfo;
   PBYTE liveBuffer;
   PBYTE liveConv;
   PBYTE convertBuffer;
   UINT formatMultiplier;
   PIXEL_FORMAT pixelFormat;
   UINT width,height,bufferSize,numStored;
   bool bReady,bCapturing, bLiveCap;
   std::string outputString;

   Nan::Callback* saveCB;
   Nan::Callback* openCB;
   Nan::Callback* endCapCB;
   Nan::Callback liveCapCB;

   uv_mutex_t liveImageMutex;
   uv_async_t liveImageAsync;

  explicit vwCam();
  virtual ~vwCam();

  static NAN_METHOD(allocateBuffer);
  static NAN_METHOD(New);
  static NAN_METHOD(GetValue);
  static NAN_METHOD(PlusOne);
  static NAN_METHOD(Multiply);
  static NAN_METHOD(output);
  static NAN_METHOD(setFrameRate);
  static NAN_METHOD(setImageGain);
  static NAN_METHOD(start);
  static NAN_METHOD(stop);
  static NAN_METHOD(save);
  static NAN_METHOD(capture);
  static NAN_METHOD(isCapturing);
  static NAN_METHOD(isReady);
  static NAN_METHOD(stopCapture);
  static NAN_METHOD(getImage);
  static NAN_METHOD(getWidth);
  static NAN_METHOD(getHeight);
  static NAN_METHOD(idle);

  static Nan::Persistent<v8::Function> constructor;
  double value_;

  static void EIO_Open(uv_work_t* req);
  static void EIO_AfterOpen(uv_work_t* req, int);
  static void LiveImageCB(uv_async_t* req);
  static void storeImage(OBJECT_INFO*, IMAGE_INFO*);


public:
  void handleSaveFinish(int);

protected:
  void run();
};

struct livePack {
  OBJECT_INFO* objInfo;
  IMAGE_INFO* imgInfo;
};

BOOL ConvertPixelFormat( PIXEL_FORMAT ePixelFormat, BYTE* pDest, BYTE* pSource, int nWidth, int nHeight );

#endif
