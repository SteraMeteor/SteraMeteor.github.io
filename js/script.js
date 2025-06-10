// js/script.js ファイル

// jQueryがロードされていることを確認し、DOMが完全に読み込まれたら実行
$(document).ready(function() {

    // --- ページのロード時のヒーローセクションアニメーション ---
    $('.hero-content > h1, .hero-content > .tagline, .hero-content > .hero-buttons').addClass('is-animated');


    // --- スクロール時のアニメーション関数 ---
    function animateOnScroll() {
        $('.fade-in-up, .fade-in').each(function() {
            var $this = $(this);
            if ($this.hasClass('is-animated')) {
                return true; // スキップ
            }

            var elementTop = $this.offset().top;
            var windowBottom = $(window).scrollTop() + $(window).height();

            if (elementTop < windowBottom * 0.95) {
                $this.addClass('is-animated');
            }
        });
    }

    // スクロールイベントをリッスン
    $(window).on('scroll', animateOnScroll);
    // ページのロード時にも一度実行
    animateOnScroll();


    // --- ページ内スムーズスクロール ---
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault(); // デフォルトのアンカーリンク挙動をキャンセル

        var href = $(this).attr('href');
        var target;

        if (href === '#') {
            target = $('html, body');
        } else {
            target = $(href);
        }

        if (target.length) {
            var position = target.offset().top;

            $('html, body').animate({
                scrollTop: position
            }, 500, 'swing');
        }
    });

    // --- お問い合わせフォームの送信処理（新規追加） ---
    initializeContactForm(); // お問い合わせフォームの機能を初期化

}); // $(document).ready の終わり


/**
 * お問い合わせフォームの送信処理を管理する関数
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm) { // フォーム要素が存在する場合のみ処理を実行
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // フォームのデフォルト送信動作をキャンセル

            // メッセージ表示をリセット
            formMessage.style.display = 'none';
            formMessage.classList.remove('success-message', 'error-message'); // 両方のクラスを削除

            // 各入力フィールドから値を取得
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            const privacyConsent = document.getElementById('privacyConsent').checked ? '同意済み' : '未同意';

            // バリデーションの簡略化 (必須項目が空でないか確認)
            if (!name || !email || !message || !document.getElementById('privacyConsent').checked) {
                formMessage.style.display = 'block';
                formMessage.textContent = '必須項目がすべて入力されているか、プライバシーポリシーに同意しているかご確認ください。';
                formMessage.classList.add('error-message');
                return; // ここで処理を中断
            }

            // ★★★ ここをあなたのGoogleフォームURLに置き換えてください ★★★
            // URLは文字列なので、引用符で囲む必要があります。
            const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfSqyvC_PWfJUPIWDGp8nNMB9lRnrYwvI4AxfIMTt_kxo2EwA'; 
            // 注意: '/viewform' は不要です。fetchのURLに '/formResponse' を追加します。

            // FormDataオブジェクトを作成し、各データを追加
            const formData = new FormData();
            // ★★★ ここをあなたのGoogleフォームのエントリーIDに置き換えてください ★★★
            // エントリーIDは文字列なので、引用符で囲む必要があります。
            formData.append('entry.702435569', name);             // お名前のエントリーIDと値
            formData.append('entry.1645834279', email);           // メールアドレスのエントリーIDと値
            formData.append('entry.565703469', subject);          // 件名のエントリーIDと値
            formData.append('entry.939436923', message);          // お問い合わせ内容のエントリーIDと値
            formData.append('entry.140261202', privacyConsent);   // プライバシー同意のエントリーIDと値

            // Fetch APIを使ってGoogleフォームにデータを送信
            fetch(googleFormUrl + '/formResponse', {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // クロスオリジン制約を回避するため
            })
            .then(() => {
                // `no-cors`モードではレスポンス内容を読み取れないため、
                // 送信成功したと仮定して常に成功メッセージを表示します。
                // 実際の送信失敗はconsole.errorでしか捕捉できません。
                formMessage.style.display = 'block';
                formMessage.textContent = 'お問い合わせありがとうございます。';
                formMessage.classList.add('success-message'); // 成功メッセージ用のクラスを追加
                contactForm.reset(); // フォームをクリア
            })
            .catch((error) => {
                formMessage.style.display = 'block';
                formMessage.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
                formMessage.classList.add('error-message');
                console.error('フォーム送信エラー:', error);
            });
        });
    } else {
        // console.warn('ID "contactForm" を持つフォームが見つかりませんでした。お問い合わせフォームのリスナーは設定されません。');
    }
}
