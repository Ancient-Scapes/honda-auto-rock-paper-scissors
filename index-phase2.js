const puppeteer = require('puppeteer');
require('dotenv').config();

async function main() {
  const browser = await puppeteer.launch({headless: false});
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
  const tweetText = '＼ #本田とカードバトル ／ #私は本田のBを引く @pepsi_jpn をフォローして 1日1回、 #本田圭佑 とカードバトル！ 勝てば、 #ペプシ #ジャパンコーラ １ケース当たる！計1000名様！ 【7/22まで #毎日挑戦 #毎日11時start 】 http://bit.ly/2IcJudY ';
  let isSuccess = true;

  // ツイートモーダル開く
  await page.evaluate(({}) => {
    const newTweetButton = document.querySelector('#global-new-tweet-button');
    if (!newTweetButton) throw newTweetButton;
    newTweetButton.click();
  },{}).catch(async (err) => {
    isSuccess = false;
  });

  await page.waitFor(500);

  // ツイート文入力
  await page.evaluate((tweetText) => {
    const tweetDiv = document.querySelector('[data-placeholder-default="What’s happening?"][aria-owns="typeahead-dropdown-6"]');
    if (!tweetDiv) throw tweetDiv;
    tweetDiv.textContent = tweetText;
    // クリックしないとツイートボタンがdisabledのままになる
    tweetDiv.click();
  }, tweetText).catch(async (err) => {
    isSuccess = false;
  });

  await page.waitFor(500);

  // ツイート
  await page.evaluate(({}) => {
    const tweetButton = document.querySelector('.SendTweetsButton');
    if (!tweetButton || tweetButton.disabled) throw tweetButton;
    tweetButton.click();
  },{}).catch(async (err) => {
    isSuccess = false;
  });

  if (isSuccess) {
    console.log('🐤  ツイート完了');
  } else {
    console.log('🍙  俺の勝ち！なんでエラーが発生したか、明日まで考えてみてください')
  }
}

main();
