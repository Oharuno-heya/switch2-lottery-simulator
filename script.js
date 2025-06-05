class LotterySimulator {
    constructor() {
        this.state = {
            lotteryState: 'initial',
            result: null
        };

        this.elements = {
            applyButton: document.getElementById('applyButton'),
            checkButton: document.getElementById('checkButton'),
            resultArea: document.getElementById('resultArea'),
            notification: document.getElementById('notification'),
            drumrollAudio: document.getElementById('drumrollAudio')
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.elements.applyButton.addEventListener('click', () => this.handleApply());
        this.elements.checkButton.addEventListener('click', () => this.handleCheck());
    }

    async handleApply() {
        if (this.state.lotteryState !== 'initial') return;

        this.state.lotteryState = 'pending';
        this.elements.applyButton.disabled = true;
        
        // ドラムロール音を再生
        this.elements.drumrollAudio.currentTime = 0;
        this.elements.drumrollAudio.play();

        // 抽選処理（3秒後に結果を決定）
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 結果を決定（30%の確率で当選）
        this.state.result = Math.random() < 0.3 ? 'won' : 'lost';

        // 通知表示
        this.showNotification();
        
        // 確認ボタンを有効化
        this.elements.checkButton.disabled = false;
    }

    handleCheck() {
        if (this.state.lotteryState !== 'pending') return;

        this.state.lotteryState = 'checked';
        this.elements.resultArea.innerHTML = this.generateEmailContent();
    }

    showNotification() {
        const notification = this.elements.notification;
        notification.textContent = 'メールが届きました！';
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 1500);
    }

    generateEmailContent() {
        const result = this.state.result;
        const isWon = result === 'won';
        
        return `
            <div class="email-container">
                <div class="email-header">
                    <span>受信</span>
                    <span>22:40</span>
                </div>
                <div class="email-body">
                    <h2>マイニンテンドーストア</h2>
                    <p>このたびはマイニンテンドーストアの「Nintendo Switch 2（日本語・国内専用）マリオカート ワールド セット」抽選販売にご応募いただきありがとうございます。</p>
                    <p>厳正なる抽選の結果、You様は${isWon ? '<span class="highlight">【当選】</span>' : '<span class="highlight error">【落選】</span>'}となりました。</p>
                    ${isWon ? `
                        <div class="highlight">
                            ■当選の結果、ご購入が可能な商品<br>
                            Nintendo Switch 2（日本語・国内専用）マリオカート ワールド セット
                        </div>
                    ` : `
                        <div>
                            【お申し込み内容】<br>
                            2025年6月2日(月)〜6月5日(木)実施<br>
                            Nintendo Switch 2（日本語・国内専用）マリオカート ワールド セット
                        </div>
                    `}
                </div>
            </div>
        `;
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new LotterySimulator();
});
