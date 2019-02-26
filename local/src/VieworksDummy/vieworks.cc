#include "vieworks.h"

#include <unistd.h>

#define RESULT_ERROR 1
#define RESULT int

Nan::Persistent<v8::Function> vwCam::constructor;

vwCam::vwCam() {
}

vwCam::~vwCam() {

}

void vwCam::Init(v8::Local<v8::Object> exports) {
  Nan::HandleScope scope;

  // Prepare constructor template
  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
  tpl->SetClassName(Nan::New("camera").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  //Prototype
  Nan::SetPrototypeMethod(tpl, "output", output);
  Nan::SetPrototypeMethod(tpl, "allocateBuffer", allocateBuffer);
  Nan::SetPrototypeMethod(tpl, "setImageGain", setImageGain);
  Nan::SetPrototypeMethod(tpl, "setFrameRate", setFrameRate);
  Nan::SetPrototypeMethod(tpl, "getWidth", getWidth);
  Nan::SetPrototypeMethod(tpl, "getHeight", getHeight);
  Nan::SetPrototypeMethod(tpl, "startCapture", start);
  Nan::SetPrototypeMethod(tpl, "stop", stop);
  Nan::SetPrototypeMethod(tpl, "save", save);
  Nan::SetPrototypeMethod(tpl, "getImage", getImage);
  Nan::SetPrototypeMethod(tpl, "capture", capture);
  Nan::SetPrototypeMethod(tpl, "stopCapture", stopCapture);
  Nan::SetPrototypeMethod(tpl, "isCapturing", isCapturing);
  Nan::SetPrototypeMethod(tpl, "idle", idle);

  constructor.Reset(tpl->GetFunction());
  exports->Set(Nan::New("camera").ToLocalChecked(), tpl->GetFunction());
}

void vwCam::setDefaults(){
  bReady = false;
  bCapturing = false;
  numStored = 0;
  uv_mutex_init(&liveImageMutex);
  uv_async_init(uv_default_loop(),&liveImageAsync,vwCam::LiveImageCB);
  bLiveCap = false;
}

void vwCam::handleSaveFinish(int saved){
  cout << "Done saving" << endl;
  const unsigned argc = 1;
  v8::Local<v8::Value> argv[argc] = { Nan::New((int)saved) };
  //Nan::MakeCallback(Nan::GetCurrentContext()->Global(), saveCB, argc, argv);
  saveCB->Call(argc,argv);
}

NAN_METHOD(vwCam::idle) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  //obj->app->processEvents();
  info.GetReturnValue().Set(Nan::New((int)0));
}

NAN_METHOD(vwCam::getWidth) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  info.GetReturnValue().Set(Nan::New((int)480));
}

NAN_METHOD(vwCam::getHeight) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  info.GetReturnValue().Set(Nan::New((int)640));
}

NAN_METHOD(vwCam::New) {
  if (info.IsConstructCall()) {
    // Invoked as constructor: `new vwCam(...)`
    vwCam* obj = new vwCam();
    obj->Wrap(info.This());
    obj->setDefaults();

    obj->openCB = new Nan::Callback(info[0].As<v8::Function>());
    uv_work_t* req = new uv_work_t();
    req->data = (void*)obj;


    //obj->open();
    uv_queue_work(uv_default_loop(),req,vwCam::EIO_Open,(uv_after_work_cb)vwCam::EIO_AfterOpen);
    info.GetReturnValue().Set(info.This());
  } else {
    // Invoked as plain function `vwCam(...)`, turn into construct call.
    const int argc = 1;
    v8::Local<v8::Value> argv[argc] = { info[0] };
    v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
    info.GetReturnValue().Set(Nan::NewInstance(cons,argc, argv).ToLocalChecked());
  }
}

void vwCam::EIO_Open(uv_work_t* req) {
  vwCam* obj = (vwCam*)(req->data);
  obj->open();
}

void vwCam::EIO_AfterOpen(uv_work_t* req, int status) {
  vwCam* obj = (vwCam*)(req->data);
  obj->allocate();
  const unsigned argc = 1;
  v8::Local<v8::Value> argv[argc] = { Nan::New((int)1) };
  obj->openCB->Call(argc,argv);
}

void vwCam::allocate(){
}

void vwCam::open(){
  usleep(2000000);

	bReady=true;
}



NAN_METHOD(vwCam::output) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  info.GetReturnValue().Set(Nan::New(obj->outputString).ToLocalChecked());
}

void vwCam::LiveImageCB(uv_async_t* req){
  // const unsigned argc = 1;//
  // // Nan::MaybeLocal<Object> ret = Nan::CopyBuffer((char*)[1,1,1,1],(size_t)(4));
  // v8::Local<v8::Value> argv[argc] = {ret.ToLocalChecked() };
  // // cam->liveCapCB.Call(argc,argv);
  // // cam->bLiveCap = false;
}


//This would pass the current, live image from the camera as a javascript array,
// if it could actually reliably pass the data.
NAN_METHOD(vwCam::getImage) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());

  if(!obj->bLiveCap){
    obj->liveCapCB.SetFunction(info[0].As<v8::Function>());
    obj->bLiveCap = true;
  }

  /*ConvertPixelFormat( PIXEL_FORMAT_BAYGR8, obj->liveConv, obj->liveBuffer,  obj->width,obj->height );

  Nan::MaybeLocal<Object> ret = Nan::CopyBuffer((char*)obj->liveConv,(size_t)(obj->bufferSize));
  info.GetReturnValue().Set(ret.ToLocalChecked());*/
}

NAN_METHOD(vwCam::capture) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  RESULT result = RESULT_ERROR;
  if(obj->bReady){
    //obj->endCapCB = new Nan::Callback(info[0].As<v8::Function>());
    obj->bCapturing = true;
    //info.GetReturnValue().Set(Nan::New((int)1));
    cout << "Began capture" << endl;
  } else {
    info.GetReturnValue().Set(Nan::New((int)RESULT_ERROR));
    cout << "Must open camera first" << endl;
  }
}

NAN_METHOD(vwCam::stopCapture) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  if(obj->bCapturing){
    obj->bCapturing = false;

    /*if(obj->endCapCB.IsCallable()){
      const unsigned argc = 1;
      v8::Local<v8::Value> argv[argc] = { Nan::New((int)obj->buffer.storageNumber()) };
      Nan::MakeCallback(Nan::GetCurrentContext()->Global(), obj->cb, argc, argv);
    }*/
    //info.GetReturnValue().Set(Nan::New((int)obj->buffer->storageNumber()));
  } else {
    info.GetReturnValue().Set(Nan::New((int)0));
    cout << "Camera not capturing." << endl;
  }
}

NAN_METHOD(vwCam::isCapturing) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  info.GetReturnValue().Set(Nan::New((int)obj->bCapturing));
}

NAN_METHOD(vwCam::setFrameRate) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  double rate = info[0]->IsUndefined() ? 1 : info[0]->NumberValue();
  RESULT result = RESULT_ERROR;
  if(obj->bReady){
    cout << "Setting frame rate" << endl;
    //CameraSetExposureMode(obj->camera,EXPOSURE_MODE_TIMED);
    /*std:ostringstream stm;
    stm << (1000000/rate);
    char* s = (char*)stm.str().c_str();*/
    //obj->camera->SetExposureMode(EXPOSURE_MODE_TIMED);
    result = 1;
    //result = CameraSetExposureTime(obj->camera,1000000/rate);
    //result = obj->camera->SetExposureTime(1000000/rate);
    info.GetReturnValue().Set(Nan::New((int)result));
    if(!result) cout << "Frame rate set to " << rate << endl;
  } else {
    info.GetReturnValue().Set(Nan::New((int)RESULT_ERROR));
    cout << "Must open camera first" << endl;
  }

}

NAN_METHOD(vwCam::setImageGain) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  double gain = info[0]->IsUndefined() ? 1 : info[0]->NumberValue();
  RESULT result = 0;
  if(obj->bReady){
    if(!result) cout << "AnalogGainAll set to " << gain << endl;
    info.GetReturnValue().Set(Nan::New((int)result));
  } else {
    info.GetReturnValue().Set(Nan::New((int)RESULT_ERROR));
    cout << "Must open camera first" << endl;
  }
}

NAN_METHOD(vwCam::start) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  RESULT result = RESULT_ERROR;
  v8::Local<v8::Function> callb = info[0].As<v8::Function>();
  if(obj->bReady){
    result = 0;
    info.GetReturnValue().Set(Nan::New((int)result));
	  if(!result) {
      cout << "Started camera. "<<endl;
      const unsigned argc = 1;
      v8::Local<v8::Value> argv[argc] = { Nan::New((int)1) };
      Nan::MakeCallback(Nan::GetCurrentContext()->Global(), callb, argc, argv);
    } else cout << "Error while starting: "<< result << endl;
  } else {
    info.GetReturnValue().Set(Nan::New((int)RESULT_ERROR));
    cout << "Must open camera first" << endl;
  }
}

NAN_METHOD(vwCam::allocateBuffer) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  double numFrames = info[0]->IsUndefined() ? 1 : info[0]->NumberValue();
  RESULT result = RESULT_ERROR;
  if(obj->bReady){
    info.GetReturnValue().Set(Nan::New(numFrames));
	  if(1) cout << "Allocated " << numFrames << " frames. "<<endl;
	  else cout << "Error while allocating: "<< result << endl;
  } else {
    info.GetReturnValue().Set(Nan::New((int)RESULT_ERROR));
    cout << "Must open camera first" << endl;
  }
}

NAN_METHOD(vwCam::stop) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  RESULT result = RESULT_ERROR;
  if(obj->bReady){
    result = 0;
    info.GetReturnValue().Set(Nan::New((int)result));
	  if(!result) cout << "Grabbed " << 600 << " Frames. "<<endl;
	  else cout << "Error while starting: "<< result << endl;
  } else {
    info.GetReturnValue().Set(Nan::New((int)RESULT_ERROR));
    cout << "Must open camera first" << endl;
  }
}

using namespace std;
using namespace v8;

NAN_METHOD(vwCam::save) {
  vwCam* obj = ObjectWrap::Unwrap<vwCam>(info.Holder());
  String::Utf8Value cmd(info[0]);
  string dir = (string(*cmd).length() ? string(*cmd) : "temp");
  //dir = string(*cmd);
  cout << dir << " equals " << string(*cmd) << endl;

  //v8::Local<v8::Function> callb = info[1].As<v8::Function>();
  obj->saveCB = new Nan::Callback(info[1].As<v8::Function>());

  RESULT result = RESULT_ERROR;
  if(600){
    int saved = 0;
    cout << "Saving..." << endl;
    const unsigned argc = 1;
    v8::Local<v8::Value> argv[argc] = { Nan::New((int)1) };
    obj->saveCB->Call(argc,argv);
  } else {
    info.GetReturnValue().Set(Nan::New((int)RESULT_ERROR));
    cout << "Record first" << endl;
  }
}
