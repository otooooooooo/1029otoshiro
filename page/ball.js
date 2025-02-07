$(function () {

    var num = 5; //ボールの初期数
    var maxNum = 10; //ボールの最大数
    var balls = []; //ボールインスタンス格納用
    var waves = []; //波インスタンス格納用
    var canvas = { //カンバスについて
        obj: $('#canvas'),
        width: $(window).width(),
        height: $(window).height()
    }
    var info = $('#info');
    var context; //カンバスのコンテキスト
    var ballAnimationFrame; //タイマー
    var addTimer; //ボール追加用タイマー
    var range = 30; // 判定範囲
    var PI2 = Math.PI * 2;

    /*----------------------------------------*/
    /* 初期化 */
    /*----------------------------------------*/
    function init() {

        //カンバス確認して、
        if (canvas.obj[0].getContext) {

            //コンテキスト生成
            context = canvas.obj[0].getContext('2d');

            //カンバスのサイズをセット
            canvas.obj.attr({
                'width': canvas.width,
                'height': canvas.height
            });

            //メッセージの位置をセット
            info.css({
                'left': canvas.width / 2 - info.width() / 2,
                    'top': canvas.height / 2 - info.height() / 2
            });

            //イベントリスナー追加
            info.one('click', function () {
                //描画開始
                start();
                info.fadeOut('slow');
            });

        } else {
            //カンバスが使えなかったらエラー表示
            info.html('ご覧頂いているブラウザはサポート対象外です。');
            return false;
        }
    }
    init();

    /*----------------------------------------*/
    /* ゲームスタート */
    /*----------------------------------------*/
    function start() {

        //ボールインスタンス生成
        for (var i = 0; i < num; i++) {
            balls[i] = new ball();
        }

        //描画開始
        // timer = setInterval(draw,100);
        ballAnimationFrame = requestAnimationFrame(draw);

        //ボールを一定時間ごとに追加 *3秒
        addTimer = setInterval(addBall, 3000);
    }

    //イベントリスナー追加
    canvas.obj.on('click', function (ev) {

        //クリックされた座標を算出
        var rect = ev.target.getBoundingClientRect();
        var clickX = ev.clientX - rect.left;
        var clickY = ev.clientY - rect.top;

        //クリック用のエフェクト描画追加
        waves.push(new wave(clickX, clickY));

        //クリック判定
        for (var i = 0; i < balls.length; i++) {
            balls[i].checkClicked(clickX, clickY);
        }

    });

    //ボール追加
    function addBall() {
        console.log('ball is added');
        balls.push(new ball());
    }


    /*----------------------------------------*/
    /* weveオブジェクト */
    /*----------------------------------------*/
    //コンストラクタ
    function wave(clickX, clickY) {
        this.range = 0;
        this.clickX = clickX;
        this.clickY = clickY;
        this.opacity = 1;
    }

    //簡易的に波を表現
    wave.prototype.diff = function () {
        //拡散させつつ透過させる
        this.range += 3;
        this.opacity -= 0.05;
        //描画
        context.beginPath();
        context.strokeStyle = 'rgba(255,255,255,' + this.opacity + ')';
        context.lineWidth = 3;
        context.arc(this.clickX, this.clickY, this.range, 0, PI2, true);
        context.stroke();
    }


    /*----------------------------------------*/
    /* ballオブジェクト */
    /*----------------------------------------*/
    //コンストラクタ
    function ball() {
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.posX = Math.random() * (canvas.width);
        this.posY = Math.random() * (canvas.height);
        this.radius = Math.random() * 5 + 25;
        this.rgb = 'rgb(' + randomColor() + ',' + randomColor() + ',' + randomColor() + ')';
        this.isAlive = true;
    }


    //座標セット&描画
    ball.prototype.setBall = function () {

        //移動
        this.posX += this.speedX;
        this.posY += this.speedY;

        //左右壁判定
        if (this.posX < 0 || this.posX > canvas.width) {
            //方向反転
            this.speedX *= -1;
        }

        //上下壁判定
        if (this.posY < 0 || this.posY > canvas.height) {
            //方向反転
            this.speedY *= -1;
        }

        //新しい座標を再描画
        context.beginPath();
        context.fillStyle = this.rgb;
        context.arc(this.posX, this.posY, this.radius, 0, PI2, true);
        context.fill();

    }

    //クリック確認
    ball.prototype.checkClicked = function (clickX, clickY) {
        if ((this.posX - range < clickX) && (clickX < this.posX + range)) {
            if ((this.posY - range < clickY) && (clickY < this.posY + range)) {
                this.isAlive = false;
            }
        }
    }

    //rgbカラーの数値をランダムで指定
    function randomColor() {
        return Math.floor(Math.random() * 256);
    }



    /*----------------------------------------*/
    /* 描画処理 */
    /*----------------------------------------*/
    function draw() {

        //前の描画を塗りつぶし
        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        //クリア、ゲームオーバー判定
        if (!balls.length || balls.length > maxNum) {

            //タイマーストップ
            cancelAnimationFrame(ballAnimationFrame);
            clearInterval(addTimer);
            if (!balls.length) {
                //おめでとうメッセージ
                info.html('CONGRATULATION!');
            } else {
                //ゲームオーバーメッセージ
                info.html('GAME OVER');
            }
            info.css({
                'left': canvas.width / 2 - info.width() / 2,
                    'top': canvas.height / 2 - info.height() / 2
            }).fadeIn('slow');

            return false;
        }

        //ボールをセット
        for (var i = 0; i < balls.length; i++) {

            //描画
            balls[i].setBall();

            //生存確認
            if (!balls[i].isAlive) {
                balls.splice(i, 1);
            }

        }

        //クリック時の波エフェクト
        for (var i = 0; i < waves.length; i++) {
            //描画
            waves[i].diff();
            //見えなくなったらリムーブ
            if (waves[i].opacity <= 0.2) {
                waves.splice(i, 1);
            }
        }

        requestAnimationFrame(draw);
    }

});