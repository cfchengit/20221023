let faceapi;
let detections = [];
let video;
let canvas
function setup() {
  canvas = createCanvas(480, 360);
  canvas.id('canvas')
  video=createCapture(VIDEO)
  video.id(video)
  video.size(width,height)
  video.hide();
  const faceOptions = {
    withLandmarks: true, //設定臉部產生遮罩
    withExpressions: true,
    withDescriptors: false,
    minConfidence: 0.5 //檢測標準
  };
  
  faceapi = ml5.faceApi(video,faceOptions,faceReady)

}

function faceReady() {
  faceapi.detect(gotFaces);// Start detecting faces: 顔認識開始
}

// Got faces: 顔を検知
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;　//Now all the data in this detections: 全ての検知されたデータがこのdetectionの中に
  // console.log(detections);
  clear();//Draw transparent background;: 透明の背景を描く
  
  translate(video.width,0);
  scale(-1,1);
  image(video,0,0);
  
  drawBoxs(detections);//Draw detection box: 顔の周りの四角の描画
  drawLandmarks(detections);//// Draw all the face points: 全ての顔のポイントの描画
  drawExpressions(detections, 20, 250, 14);//Draw face expression: 表情の描画

  faceapi.detect(gotFaces);// Call the function again at here: 認識実行の関数をここでまた呼び出す
}
function draw() {
  // background(220);
  // clear();
  
  // translate(video.width,0)
  // scale(-1,1)
  // image(video,0,0)
  // drawBoxs(detections)
  // drawLandmarks(detections) 
  // drawExpressions(detections, 20, 250, 14) 
}

function drawBoxs(detections){
  if(detections.length>0){
    for(let f=0;f<detections.length;f++){
      // let x= detections[0].alignedRect._box._x;
      // let y= detections[0].alignedRect._box._y;
      // let recWidth= detections[0].alignedRect._box._width;
      // let recHeight= detections[0].alignedRect._box._height;
      let {_x,_y,_width,_height} =detections[0].alignedRect._box
      stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
    
  }
}

function drawLandmarks(detections){
  if (detections.length > 0) {//If at least 1 face is detected: もし1つ以上の顔が検知されていたら
    for (f=0; f < detections.length; f++){
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke(44, 169, 225);
        strokeWeight(5);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace){
  scale(-1,1)
  translate(-video.width,0)
  if(detections.length > 0){//If at least 1 face is detected: もし1つ以上の顔が検知されていたら
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} = detections[0].expressions;
    textFont('Helvetica Neue');
    textSize(14);
    noStroke();
    // fill(44, 169, 225);
    
    fill(255,255,0)
    text("中性:       " + nf(neutral*100, 2, 2)+"%", x, y);
    text("幸福: " + nf(happy*100, 2, 2)+"%", x, y+textYSpace);
    text("憤怒:        " + nf(angry*100, 2, 2)+"%", x, y+textYSpace*2);
    text("傷心:            "+ nf(sad*100, 2, 2)+"%", x, y+textYSpace*3);
    text("厭惡: " + nf(disgusted*100, 2, 2)+"%", x, y+textYSpace*4);
    text("吃驚:  " + nf(surprised*100, 2, 2)+"%", x, y+textYSpace*5);
    text("恐懼:           " + nf(fearful*100, 2, 2)+"%", x, y+textYSpace*6);
  }else{//If no faces is detected: 顔が1つも検知されていなかったら
    text("neutral: ", x, y);
    text("happiness: ", x, y + textYSpace);
    text("憤怒: ", x, y + textYSpace*2);
    text("傷心: ", x, y + textYSpace*3);
    text("disgusted: ", x, y + textYSpace*4);
    text("surprised: ", x, y + textYSpace*5);
    text("恐懼: ", x, y + textYSpace*6);
    
  }
  
}
