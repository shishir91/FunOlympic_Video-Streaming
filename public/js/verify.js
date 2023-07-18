//   console.log(email)
//   console.log(isLogin)
//   console.log("isLogin")
//   document.getElementById("email").value = req.session.user_email;

const verifyEmailButton = document.getElementById('verify-email-button');
const resendCodeButton = document.getElementById('resend-code-button');
const countdownTimer = document.getElementById('countdown-timer');

let countdownTime = 1;

function startCountdown() {
  // verifyEmailButton.style.display = 'none';

  countdownTimer.textContent = formatCountdown(countdownTime);
  
  const countdownInterval = setInterval(() => {
    countdownTime--;
    
    countdownTimer.textContent = formatCountdown(countdownTime);
    
    if (countdownTime <= 0) {
      clearInterval(countdownInterval);

      resendCodeButton.style.display = 'block';
      
      countdownTime = 1;
      countdownTimer.textContent = '';
    }
  }, 1000);
}

function formatCountdown(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `Send code again in ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
startCountdown();
verifyEmailButton.addEventListener('click', startCountdown);
resendCodeButton.addEventListener('click', () => {
    startCountdown();
    resendCodeButton.style.display = 'none';
    let email = document.getElementById("email");
    // let respo = await postData("/sendmail", { email });
    console.log("email");
    console.log(email.value);
});
