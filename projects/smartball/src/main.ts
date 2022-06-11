import * as b2 from "@akashic-extension/akashic-box2d"
import { FilledRect } from "@akashic/akashic-engine"
function main(param: g.GameMainParameterObject): void {

  const PATHS = {
    DOME_LEFT: '0 0 0 250 19 250 20 231.9 25.7 196.1 36.9 161.7 53.3 129.5 74.6 100.2 100.2 74.6 129.5 53.3 161.7 36.9 196.1 25.7 231.9 20 268.1 20',
    DOME_RIGHT: '268.1 20 303.9 25.7 338.3 36.9 370.5 53.3 399.8 74.6 425.4 100.2 446.7 129.5 463.1 161.7 474.3 196.1 480 231.9 480 250 500 250 500 0 0 0',
    DROP_LEFT: '0 0 20 0 70 100 20 150 0 150 0 0',
    DROP_RIGHT: '50 0 68 0 68 150 50 150 0 100 50 0',
    APRON_LEFT: '0 0 180 120 0 120 0 0',
    APRON_RIGHT: '180 0 180 120 0 120 180 0'
  } as const

  const scene = new g.Scene({
    game: g.game,
    assetIds: ["ball"]
  });
  scene.onLoad.add(() => {
    // 以下にゲームのロジックを記述します。
    // 物理エンジン世界の生成
    const worldProperty:b2.Box2DParameter = {
      gravity: [0, 9.8],
      scale: 50,
      sleep: true
    };
    const physics = new b2.Box2D(worldProperty);
    // 地面エンティティの生成
    const floor = new g.FilledRect({
      scene: scene,
      cssColor: "black",
      x: 0,
      y: g.game.height - 50,
      width: g.game.width,
      height: 50
    });
    scene.append(floor);
    // 地面エンティティの性質を定義
    const floorDef = physics.createFixtureDef({
        density: 1.0,
        friction: 0.5,
        restitution: 0.3,
        shape: physics.createRectShape(floor.width, floor.height) // 地面エンティティを四角に設定
    });
    // 地面エンティティを静的物体化
    const staticDef = physics.createBodyDef({
        type: b2.BodyType.Static
    });
    // Box2Dに地面エンティティを追加
    const floorBody = physics.createBody(floor, staticDef, floorDef);

    // ボールエンティティの作成
    const ball = new g.Sprite({
      scene: scene,
      src: scene.assets["ball"] as g.ImageAsset,
      x: 105,
      y: 30,
      width: 16,
      height: 16,
      srcWidth: 16,
      srcHeight: 16,
      touchable: true
    });
    scene.append(ball);

    // polygonエンティティの生成
    createPolygon(scene,worldProperty,physics,pathToVerts(PATHS.DOME_LEFT))
    createPolygon(scene,worldProperty,physics,pathToVerts(PATHS.DOME_RIGHT))
    // createPolygon(scene,worldProperty,physics,pathToVerts(PATHS.DROP_LEFT))
    // createPolygon(scene,worldProperty,physics,pathToVerts(PATHS.DROP_RIGHT))
    // createPolygon(scene,worldProperty,physics,pathToVerts(PATHS.APRON_LEFT))
    // createPolygon(scene,worldProperty,physics,pathToVerts(PATHS.APRON_RIGHT))

    // エンティティの性質を定義
    const entityDef = physics.createFixtureDef({
      density: 1.0,
      friction: 0.5,
      restitution: 1.2//0.3 // 反発係数
    });
    // 動的物体化
    const dynamicDef = physics.createBodyDef({
      type: b2.BodyType.Dynamic
    });
    // ボールエンティティを円に設定
    entityDef.shape = physics.createCircleShape(ball.width);
    // ボールエンティティをBox2Dに追加
    const ballBody = physics.createBody(ball, dynamicDef, entityDef);
    // 接触イベントのリスナーを生成
    const contactListener = new b2.Box2DWeb.Dynamics.b2ContactListener();
    // 接触開始時のイベントリスナー
    contactListener.BeginContact = function (contact) {
        // サッカーボールと地面がぶつかったら地面の色を青にする
        if (physics.isContact(floorBody, ballBody, contact)) {
            floor.cssColor = "blue";
            floor.modified();
        }
    };
    // 接触が離れた時のイベントリスナー
    contactListener.EndContact = function (contact) {
        // サッカーボールと地面が離れたら地面の色を黒にする
        if (physics.isContact(floorBody, ballBody, contact)) {
            floor.cssColor = "black";
            floor.modified();
        }
    };
    // イベントリスナーを設定
    physics.world.SetContactListener(contactListener);
    scene.onUpdate.add(function () {
      // 物理エンジンの世界をすすめる
      physics.step(1 / g.game.fps)
    });
  });
  g.game.pushScene(scene);
}

/**
 * パス文字列から頂点配列を生成する
 * @param {string} path パス文字列 ex) 0 0 100 100 ... (x1 y1 x2 y2 ...)
 */
 function pathToPoints(path: string): number[][] {
  const points:number[][] = []
  const pathArray = path.split(' ');
  for(let i = 0; i < pathArray.length/2; i++) {
    const _point:number[] = []
    _point.push(Number(pathArray[i*2+0]))
    _point.push(Number(pathArray[i*2+1]))
    points.push(_point)
  }
  return points
}

/**
 * パス文字列から頂点配列を生成する
 * @param {string} path パス文字列 ex) 0 0 100 100 ... (x1 y1 x2 y2 ...)
 */
function pathToVerts(path: string): b2.Box2DWeb.Common.Math.b2Vec2[] {
  const verts:b2.Box2DWeb.Common.Math.b2Vec2[] = []
  const pathArray = path.split(' ');
  for(let i = 0; i < pathArray.length/2; i++) {
    verts.push(new b2.Box2DWeb.Common.Math.b2Vec2( Number(pathArray[i*2+0]) , Number(pathArray[i*2+1])))
  }
  return verts
}

/**
 * 線を生成する
 * @param {g.Scene} scene 描画を行うシーン
 * @param {Object} line 線の端座標の情報
 * @param {number} weight 線の太さ
 * @param {string} color 描画色
 */
function createLine(scene: g.Scene, line: any, weight:number, color:string): FilledRect {
  const dist = line.end.Copy();
  dist.Subtract(line.begin);

  const length = dist.Length();
  const angle = Math.atan2(dist.y, dist.x) * (180 / Math.PI);

  // AkashicEngineでは線を描画できないので、細い矩形で描画する
  const l = new g.FilledRect({
    scene: scene,
    width: length,
    height: weight,
    anchorX: 0.0,
    anchorY: 0.5,
    angle: angle,
    cssColor: color
  });
  l.x = line.begin.x;
  l.y = line.begin.y;

  return l;
}

/**
 * 衝突判定を持った多角形を生成する
 * @param {g.Scene} scene 描画を行うシーン
 * @param {b2Vec2[]}} vertices 頂点配列
 */
function createPolygon(scene: g.Scene,
    worldProperty:b2.Box2DParameter,
    physics:b2.Box2D,
    vertices: b2.Box2DWeb.Common.Math.b2Vec2[]):void {
  const entity = new g.E({
    scene: scene
  });
  const length = vertices.length;
  for (let i = 0; i < length - 1; ++i) {
    const line = {
      begin: vertices[i],
      end: vertices[i + 1 === length ? 0 : i + 1]
    };
    entity.append(createLine(scene, line, 3, "teal"));
  }
  scene.append(entity);

  // Box2D用に座標のスケールを変換＆末尾の要素を削除
  const box2dVertices = [];
  for (let j = 0; j < vertices.length - 1; ++j) {
    const vertex = vertices[j].Copy();
    vertex.Multiply(1.0 / worldProperty.scale);
    box2dVertices.push(vertex);
  }

  // 頂点数が偶数かどうかで、外力の影響を受けるかを切り替える
  /** 動的オブジェクトの生成パラメータ */
  const staticParameter = {
    body: physics.createBodyDef({
      type: b2.BodyType.Static // 空間に固定される物体
    }),
    fixture: physics.createFixtureDef({
      density: 1.0,
      friction: 0.5,
      restitution: 0.5
    })
  };
  // const dynamicParameter = {
  //   /** 物理挙動 */
  //   body: physics.createBodyDef({
  //     type: b2.BodyType.Dynamic // 自由に動ける物体
  //   }),
  //   /** 物理性質 */
  //   fixture: physics.createFixtureDef({
  //     density: 1.0, // 密度
  //     friction: 0.5, // 摩擦係数
  //     restitution: 0.5 // 反発係数
  //   })
  // };

  staticParameter.fixture.shape = physics.createPolygonShape(box2dVertices);
  physics.createBody(entity, staticParameter.body, staticParameter.fixture);
}


export = main;
