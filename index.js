const puppeteer = require('puppeteer');
require('dotenv').config();

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await login(page);
    await tweetPepsi(page)
  } catch (error) {
    console.log(error);
  } finally {
    browser.close();
  }
}

async function login(page) {
  const URL = 'https://twitter.com/login';

  await page.goto(URL, {waitUntil: "domcontentloaded"});

  // ログイン情報入力、ログインボタン押下
  await page.evaluate((id, password) => {
    document.querySelector('.js-username-field').value = id;
    document.querySelector('.js-password-field').value = password;
    document.querySelector('.js-signin').submit();
  }, process.env.ACCOUNT_ID, process.env.ACCOUNT_PASSWORD);

  await page.waitForNavigation();

  console.log('✨  ログイン成功');
}

async function tweetPepsi(page) {
  const tweetText = '@pepsi_jpn #本田とじゃんけん #本田にパーで勝つ';

  // ツイートモーダル開く
  await page.evaluate(({}) => {
    document.querySelector('#global-new-tweet-button').click();
  },{});

  await page.waitFor(500);

  // ツイート文入力
  await page.evaluate((tweetText) => {
    document.querySelector('#Tweetstorm-tweet-box-0 > div.tweet-box-content > div.tweet-content > div.RichEditor.RichEditor--emojiPicker.is-fakeFocus > div.RichEditor-container.u-borderRadiusInherit > div.RichEditor-scrollContainer.u-borderRadiusInherit > div.tweet-box.rich-editor.is-showPlaceholder > div').textContent = tweetText;
  }, tweetText);

  // await page.screenshot({
  //   path: "test2-0.png",
  //   fullPage: true
  // });

  // ツイート
  await page.evaluate(({}) => {
    document.querySelector('.SendTweetsButton').click();
  },{});

  console.log('🐤  ツイート完了');
}

main();
