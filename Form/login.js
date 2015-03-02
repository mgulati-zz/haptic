var loginBtn;

var button = new Button(function(btn) {
  if (!loginBtn.hasClass('disabled') && btn.currentColor != "#ff0000") {
    
    if (btn.touch == 1 || $(".login-button:hover").length > 0) {
      loginBtn.addClass("hovered");
      btn.changeColor('#0000ff');
    }
    else {
      loginBtn.removeClass("hovered");
      btn.changeColor('#00ff00');
    }

    if (btn.position < 800 && btn.touch == 1 && btn.desiredPosition == 1000) {
      loginBtn.addClass("clicking");
    } else {
      loginBtn.removeClass("clicking");
    }

    if (btn.position < 500 && btn.touch == 1 && btn.desiredPosition == 1000) {
      logIn();
    }

  } else {
    btn.changeColor('#000000');
    btn.sendTarget(0);
  }

});
button.disableSlide();

function logIn() {
  if (!loginBtn.hasClass('disabled')) {
    $(".error-message").html("");
    var name = $("#name").val();
    var password = $("#password").val();
    if (name == '' || password == '') {
      $(".error-message").html("Please fill in all information");
      console.log('Please fill in all information');
      loginBtn.addClass('disabled');
      button.changeColor('#000000');
      button.sendTarget(0);
    } else {
      loginBtn.html("LOGGING IN...");
      button.changeColor('#ffffff');
      button.sendTarget(60);
      window.setTimeout(function (){
        if (password === 'password') {
          $(".form").css("display","none");
          $(".success").css("display","block");
          button.changeColor('#00ff00');
          button.sendTarget(30);
        } else {
          $(".error-message").html("Password is incorrect");
          loginBtn.html("LOG IN");
          button.changeColor('#ff0000');
          button.sendTarget(100);
        }
      }, 1000);
    }
  }  
}

$(document).ready(function(){

  loginBtn = $(".login-button");
  loginBtn.click(logIn);

  $("input").keyup(function(){
    var name = $("#name").val();
    var password = $("#password").val();
    if (name != '' && password != '') {
      loginBtn.removeClass('disabled');
      button.changeColor('#00ff00');
      button.sendTarget(100);
    } else {
      loginBtn.addClass('disabled');
      button.changeColor('#000000');
      button.sendTarget(0);
    }
  })

});