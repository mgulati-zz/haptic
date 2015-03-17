class pixel {
  int dirDown;
  int dirUp;
  
  int ledR;
  int ledG;
  int ledB;
  int motor;
  
  int actualPos;
  int desiredPos;
  int lastPos;
  int analogPos;
  
  double kI;
  double kP;
  double kD;
  
  int integral;
  int derivative;
  
  int allowSlide;
  int touchState;
  
  int red;
  int blue;
  int green;
  
  pixel() {
  }
  ~pixel() {
  }
  
};
