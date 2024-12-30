import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';

import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  volumes: { name: string; volume: number; }[] = [];

[x: string]: any;

zoomIn() {
throw new Error('Method not implemented.');
}
zoomOut: any;
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('renderCanvas', { static: true })
  renderCanvas!: ElementRef<HTMLCanvasElement>;

  private engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;

  constructor() {}

  ngAfterViewInit() {
    const canvas = this.renderCanvas.nativeElement;
    this.initializeBabylon();
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.engine.resize();
    });
  }
  
  resizeCanvas() {
    const canvas = this.renderCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100; // Sesuaikan 50 dengan tinggi topbar Anda
  }
  

  async initializeBabylon() {
    const canvas = this.renderCanvas.nativeElement;
    this.engine = new BABYLON.Engine(canvas, true);

    this.scene = await this.createScene();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  
  async createScene(): Promise<BABYLON.Scene> {
    const scene = new BABYLON.Scene(this.engine);
  
    // Mengganti FreeCamera dengan ArcRotateCamera
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 4, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(this.renderCanvas.nativeElement, true);
  
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);
  
    await this.loadLiDARData(scene);
  
    return scene;
  }
  

  async loadLiDARData(scene: BABYLON.Scene): Promise<void> {
    const response = await axios.get('assets/data.txt');

    const points = response.data.split('\n').map((line: string) => {
      const parts = line.trim().split(',').map(Number);
      return new BABYLON.Vector3(parts[0], parts[1], parts[2]);
    });

    const pointCloud = new BABYLON.PointsCloudSystem('pointCloud', 1, scene);
    pointCloud.addPoints(points.length, (particle: { position: { copyFrom: (arg0: any) => void; }; }, i: number) => {
      const point = points[i];
      particle.position.copyFrom(point);
    });
    
    pointCloud.buildMeshAsync();
  }
}
