import * as b2 from "@akashic-extension/akashic-box2d"
function main(param: g.GameMainParameterObject): void {
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
    const verts:b2.Box2DWeb.Common.Math.b2Vec2[] = []
    verts.push(new b2.Box2DWeb.Common.Math.b2Vec2(0,0))
    verts.push(new b2.Box2DWeb.Common.Math.b2Vec2(100,0))
    verts.push(new b2.Box2DWeb.Common.Math.b2Vec2(0,100))
    createPolygon(scene,worldProperty,physics,verts)

    // エンティティの性質を定義
    const entityDef = physics.createFixtureDef({
      density: 1.0,
      friction: 0.5,
      restitution: 0.3 // 反発係数
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
      physics.step(1 / g.game.fps);
    });
  });
  g.game.pushScene(scene);
}

/**
 * 線を生成する
 * @param {g.Scene} scene 描画を行うシーン
 * @param {Object} line 線の端座標の情報
 * @param {number} weight 線の太さ
 * @param {string} color 描画色
 */
 function createLine(scene: g.Scene, line: any, weight:number, color:string) {
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
    vertices: b2.Box2DWeb.Common.Math.b2Vec2[]) {
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
