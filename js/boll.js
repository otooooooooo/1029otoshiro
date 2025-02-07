//マウスボタンが押されているかどうか
boolean isPressed = false;
//地面に触れることによる速度の減退
final float damp = 0.95;

// ボールクラス
class Ball {
  //X座標
  public float X;
  //Y座標
  public float Y;
  //X速度
  public float speedX;
  //Y速度
  public float speedY;
  
  //コンストラクタ
  public Ball(float X, float Y, float speedX, float speedY) {
   // 指定されたX,Y,speedを設定
    this.X = X;
    this.Y = Y;
    this.speedX = speedX;
    this.speedY = speedY;
  }
}
ArrayList<Ball> balls = new ArrayList<Ball>();

// 重力加速度
final float GRAVITY = 9.8;
final float reaction = 0.7;

// 初期設定
void setup() {
  // 画面のサイズを600x600に設定
  size(600,600);
  background(255);
}

// マウスボタンが押された時
void mousePressed() {
  isPressed = true;
}
//マウスボタンが離された時
void mouseReleased() {
  isPressed = false;
}


// 描画処理
void draw() {
  //マウスボタンが押されている時だけ新しいボールを追加
  if(isPressed) {
    // ボール初速(マイナスは上方向)
    float initSpeedX = random(-30, 30);
    float initSpeedY = random(-20, 0);
    // ボール一覧にボールを追加
    balls.add(new Ball(mouseX, mouseY, initSpeedX, initSpeedY));
  }

  // 白に塗りつぶし
  background(255);
  // ボールのスタイル設定
  // ボールの塗りつぶし
  fill(0,0,0);
  // 青で描画
  stroke(255,255,255);

  // ボールの数だけ描画する
  for(int i = balls.size() -1; i >= 0; i--) {
    // ボールデータを一覧から取得
    Ball ball = balls.get(i);
    // ボールを描画
    ellipse(ball.X, ball.Y, 10, 10);
    // ボールの次の位置を計算する
    // スピードに加速度を加算
    ball.speedY += GRAVITY / 5;
    // X座標
    ball.X += ball.speedX / 5;
    // Y座標に速度分追加
    ball.Y += ball.speedY / 5;
    if (ball.X > width || ball.X < 0) ball.speedX = -ball.speedX;
    if (ball.Y > height) {
      ball.speedY *= -reaction;
      ball.speedX *= damp;
      ball.Y = height;    //ボールは画面の外に外れない
    }
  }
}