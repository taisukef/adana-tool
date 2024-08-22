const submitButton = document.querySelector('#submit-button');
const lastNameInput = document.querySelector('#last-name');
const firstNameInput = document.querySelector('#first-name');
const nicknameCountInput = document.querySelector('#nickname-count');
const resultTextArea = document.querySelector('#result-text');
const customModifierInput = document.querySelector('#custom-modifier');
const savedModifiersTextArea = document.querySelector('#saved-modifiers');
const checkboxes = document.querySelectorAll('input[name="nickname_type"]');

let savedModifiers = [];

// ローカルストレージから保存された修飾語を読み込む
function loadSavedModifiers() {
  const saved = localStorage.getItem('customModifiers');
  if (saved) {
    savedModifiers = JSON.parse(saved);
    savedModifiersTextArea.value = savedModifiers.join(', ');
  }
}

// 保存された修飾語をローカルストレージに保存
function saveCustomModifier(modifier) {
  savedModifiers.push(modifier);
  localStorage.setItem('customModifiers', JSON.stringify(savedModifiers));
  savedModifiersTextArea.value = savedModifiers.join(', ');
}

submitButton.addEventListener('click', () => {
  const selectedCheckboxes = Array.from(checkboxes)
                                   .filter(cb => cb.checked)
                                   .map(cb => cb.value);

  const customModifier = customModifierInput.value.trim();
  if (customModifier) {
    saveCustomModifier(customModifier);
  }

  const formData = {
    lastName: lastNameInput.value || '',
    firstName: firstNameInput.value || '',
    nicknameTypes: selectedCheckboxes,
    customModifier: customModifier,  // カスタム修飾語を追加
    isForeigner: document.querySelector('input[name="foreigner"]:checked') ? 
                 document.querySelector('input[name="foreigner"]:checked').value : 'No',
    nicknameCount: nicknameCountInput.value || 1,
  };

  console.log("送信するデータ:", formData);

  fetch("/api/hello", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        resultTextArea.value = `結果:\n${data.result}`;
      });
    } else {
      console.error("APIリクエストが失敗しました。ステータス:", response.status);
    }
  }).catch((error) => {
    console.error("APIリクエスト中にエラーが発生しました:", error);
  });
});

loadSavedModifiers(); // ページ読み込み時に保存された修飾語を表示
