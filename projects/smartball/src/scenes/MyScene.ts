import Phaser from "phaser"
//import {Segpath} from "segpath"

const PATHS = {
  DOME_LEFT: '0 0 0 250 19 250 20 231.9 25.7 196.1 36.9 161.7 53.3 129.5 74.6 100.2 100.2 74.6 129.5 53.3 161.7 36.9 196.1 25.7 231.9 20 268.1 20',
  DOME_RIGHT: '268.1 20 303.9 25.7 338.3 36.9 370.5 53.3 399.8 74.6 425.4 100.2 446.7 129.5 463.1 161.7 474.3 196.1 480 231.9 480 250 500 250 500 0 0 0',
  DROP_LEFT: '0 0 20 0 70 100 20 150 0 150 0 0',
  DROP_RIGHT: '50 0 68 0 68 150 50 150 0 100 50 0',
  APRON_LEFT: '0 0 180 120 0 120 0 0',
  APRON_RIGHT: '180 0 180 120 0 120 180 0'
} as const
const COLOR = {
  BACKGROUND: 0x212529,
  OUTER: 0x495057,
  INNER: 0x15aabf,
  BUMPER: 0xfab005,
  BUMPER_LIT: 0xfff3bf,
  PADDLE: 0xe64980,
  PINBALL: 0xdee2e6,
} as const

export class MyScene extends Phaser.Scene {
  //物理オブジェクトの宣言
  public ball: Phaser.Physics.Matter.Image | undefined
  public pins: Phaser.Physics.Matter.Image[] = []
  
  constructor() {
    super({ key: 'myscene', active: true })
  }

  public preload() {
    //画像の読み込み
    this.load.image('ball', 'src/assets/images/ball.png')
    this.load.image('pin', 'src/assets/images/pin.png')
  }

  public create() {
    //背景を白に
    this.cameras.main.setBackgroundColor('#ffffff')

    //画面端に当たり判定を設定
    this.matter.world.setBounds(0, 0, this.sys.canvas.width, this.sys.canvas.height)
    this.matter.world.add([
      this.boundary(250, -30, 500, 100),
      this.boundary(250, 830, 500, 100),
      this.boundary(-30, 400, 100, 800),
      this.boundary(530, 400, 100, 800),
      this.path(69, 86, PATHS.DOME_LEFT),
      this.path(425, 86, PATHS.DOME_RIGHT),
      this.wall(140, 140, 20, 40, COLOR.INNER),
      this.wall(225, 140, 20, 40, COLOR.INNER),
      this.wall(310, 140, 20, 40, COLOR.INNER),
      // bumper(105, 250),
      // bumper(225, 250),
      // bumper(345, 250),
      // bumper(165, 340),
      // bumper(285, 340),
      this.wall(440, 520, 20, 560, COLOR.OUTER),
      this.path(25, 360, PATHS.DROP_LEFT),
      this.path(425, 360, PATHS.DROP_RIGHT),
      this.wall(120, 510, 20, 120, COLOR.INNER),
      this.wall(330, 510, 20, 120, COLOR.INNER),
      this.wall(60, 529, 20, 160, COLOR.INNER),
      this.wall(390, 529, 20, 160, COLOR.INNER),
      this.wall(93, 624, 20, 98, COLOR.INNER, -0.96),
      this.wall(357, 624, 20, 98, COLOR.INNER, 0.96),
      this.path(79, 740, PATHS.APRON_LEFT),
      this.path(371, 740, PATHS.APRON_RIGHT),
    ])

    //物理オブジェクトを作成
    this.ball = this.matter.add.image(
        this.sys.canvas.width / 2,
        this.sys.canvas.height / 2,
        'ball', undefined,
        { circleRadius: 8 }
    );

    //ボールの反発係数、初期速度、摩擦係数を設定
    this.ball.setBounce(1.1);
    // this.ball.setVelocityY(Phaser.Math.Between(-20, 20));
    // this.ball.setVelocityX(Phaser.Math.Between(-20, 20));
    this.ball.setFriction(0, 0, 0)
 
    // for(let i = 0; i < 40; i++) {
    //   const pin = this.matter.add.image(
    //     this.sys.canvas.width / 2 + Phaser.Math.Between(-150, 150),
    //     this.sys.canvas.height / 2 + Phaser.Math.Between(-150, 150),
    //     'pin', undefined,
    //     { circleRadius: 1 }
    //   );
    //   pin.setStatic(true)
    //   this.pins.push(pin)
    // }

    // const arc = this.add.arc(150,350,90, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(180),true,0xff0000)
    // this.matter.add.gameObject(arc, {
    //   isStatic: true,
    // });

    // const circle = this.add.circle(150, 350, 50, 0x777777);
    // this.matter.add.gameObject(circle, {
    //   isStatic: true,
    //   shape: 'circle',
    //   render: {
    //       sprite: {
    //           yOffset: 0
    //       }
    //   } 
    // });

    // const frames = [
    //   '0 0 0 200 200 200',
    //   '200 -200 0 -200 0 0',
    //   '0 200 200 200 200 0',
    //   '200 -200 0 -200 200 0',
    // ];
    // const zone_1 = this.add.zone(75, 400, 200, 200)
    // this.matter.add.gameObject(zone_1, {
    //   isStatic: true,
    //   shape: { type: 'fromVerts', verts: frames[0], flagInternal: true }
    // })
    // const zone_2 = this.add.zone(75, 130, 200, 200)
    // this.matter.add.gameObject(zone_2, {
    //   isStatic: true,
    //   shape: { type: 'fromVerts', verts: frames[1], flagInternal: true }
    // })
    // const zone_3 = this.add.zone(340, 400, 200, 200)
    // this.matter.add.gameObject(zone_3, {
    //   isStatic: true,
    //   shape: { type: 'fromVerts', verts: frames[2], flagInternal: true }
    // })
    // const zone_4 = this.add.zone(340, 130, 200, 200)
    // this.matter.add.gameObject(zone_4, {
    //   isStatic: true,
    //   shape: { type: 'fromVerts', verts: frames[3], flagInternal: true }
    // })

    // this.matter.add.fromVertices(200,200,
    //   'L5 10 L100 0 L95 95 L0 100 L5 80 L80 75 L85 15 L0 20', { isStatic: true})
    // this.matter.add.fromVertices(200,200,
    //   '0 0 0 250 19 250 20 231.9 25.7 196.1 36.9 161.7 53.3 129.5 74.6 100.2 100.2 74.6 129.5 53.3 161.7 36.9 196.1 25.7 231.9 20 268.1 20 303.9 25.7 338.3 36.9 370.5 53.3 399.8 74.6 425.4 100.2 446.7 129.5 463.1 161.7 474.3 196.1 480 231.9 480 250 500 250 500 0 0 0', 
    //   { isStatic: true})
    // this.matter.add.fromVertices(200,200,
    //   '0 0 180 120 0 120 0 0', 
    //   { isStatic: true})
    
    
  }

  private boundary(x:number, y:number, width:number, height:number) {
    this.add.rectangle(x,y,width,height,COLOR.OUTER)
    return this.matter.bodies.rectangle(x, y, width, height, {
      isStatic: true
    });
  }

  private wall(x:number, y:number, width:number, height:number, color:number, angle:number = 0) {
    const _rect = this.add.rectangle(x,y,width,height,color)
    _rect.angle = Phaser.Math.RadToDeg(angle)
    return this.matter.bodies.rectangle(x, y, width, height, {
      angle: angle,
      isStatic: true,
      chamfer: { 
        radius: 10 
      }
    });
  }

  private path(x:number, y:number, path:string) {
    // console.log("path")
    // console.log(path)
    const vertices = [this.matter.vertices.fromPath(path,this.matter.body.create({}))];
    const _body = this.matter.bodies.fromVertices(x, y, vertices, {
      isStatic: true
    });
    
    const _points = []
    if(_body.vertices) {
      for(const _vert of _body.vertices) {
        _points.push(new Phaser.Math.Vector2(_vert.x,_vert.y))
      }
      const _p = this.add.polygon(x,y,_points,COLOR.BUMPER)
      _p.scale = 0.25
      console.log(_p.scale)
      // _p.scale = 0.5
    }
    return _body
  }
}