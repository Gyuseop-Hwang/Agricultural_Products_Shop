import * as Api from '/js/api.js';
import { validateEmail } from '/js/useful-functions.js';

// 요소(element), input 혹은 상수
const fullNameInput = document.getElementById("fullNameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const passwordConfirmInput = document.getElementById("passwordConfirmInput");
const phoneNumberInput = document.getElementById("phoneNumberInput");
const postalCodeInput = document.getElementById("postalCodeInput");
const address1Input = document.getElementById("address1Input");
const address2Input = document.getElementById("address2Input");

/*버튼*/
const postalCodeBtn = document.getElementById("postalCodeBtn");
const btnFoldWrap = document.getElementById("btnFoldWrap");
const submitButton = document.getElementById("submitButton");
addAllEvents();

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const phoneNumber = phoneNumberInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 8;
  const isPasswordSame = password === passwordConfirm;
  const isPostalCodeValid = postalCode.length === 5;

  if (!isFullNameValid || !isPasswordValid) {
    return alert('이름은 2글자 이상, 비밀번호는 8글자 이상이어야 합니다.');
  }

  if (!isEmailValid) {
    return alert('이메일 형식이 맞지 않습니다.');
  }

  if (!isPasswordSame) {
    return alert('비밀번호가 일치하지 않습니다.');
  }
  if (!isPostalCodeValid) {
    return alert('우편번호가 5자리가 아닙니다.');
  }

  // 회원가입 api 요청
  try {
    const data = {
      fullName,
      email,
      password,
      passwordConfirm,
      address: { postalCode, address1, address2 },
      phoneNumber,
    };

    await Api.post('/api/register', data);

    alert(`정상적으로 회원가입되었습니다.`);

    // 로그인 페이지 이동
    window.location.href = '/login';
  } catch (err) {
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

/*다음 주소 API*/
postalCodeBtn.addEventListener("click", sample3_execDaumPostcode);
btnFoldWrap.addEventListener("click", foldDaumPostcode);
const element_wrap = document.getElementById('wrap');

function foldDaumPostcode() {
  element_wrap.style.display = 'none';
}

function sample3_execDaumPostcode() {
  let currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
  new daum.Postcode({
    oncomplete: function (data) {

      let addr = '';
      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }
      postalCodeInput.value = data.zonecode;
      address1Input.value = addr;
      address2Input.focus();

      element_wrap.style.display = 'none';

      document.body.scrollTop = currentScroll;
    },

    onresize: function (size) {
      element_wrap.style.height = size.height + 'px';
    },
    width: '100%',
    height: '100%'
  }).embed(element_wrap);

  element_wrap.style.display = 'block';
}
