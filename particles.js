/*
 * Stellar Cloud
 * A Three.js Procedural Point Cloud System
 * (c) 2015 Stelatech.com All Rights Reserved.
 */
(function(window, THREE) {
  "use strict";
  var renderer, resizer, postprocessing, camera, scene, clock, mesh;

  /**
   * Start Three.js Rendering Engine.
   */
  function start() {
    //Create Engine Components
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(45, 1.6, .001, 100);
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    resizer = new THREE.WindowResizer(renderer, camera, 1.6, composer);
    resizer.trigger();
    //Camera
    camera.position.set(.33, .25, -.25);
    camera.lookAt(scene.position);
    scene.add(camera);

    //Canvas
    var container = document.getElementById('threejs');
    container.appendChild(renderer.domElement);

    //Post-Process
    postprocessing = {};
    var composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    var stelaEffect = new THREE.ShaderPass(THREE.StelaGradientShader);
    composer.addPass(stelaEffect);
    var bokehPass = new THREE.BokehPass(scene, camera, {
      focus: 1.0,
      aperture: 0.01,
      maxblur: 1.0,
      width: resizer.w,
      height: resizer.h
    });
    composer.addPass(bokehPass);
    bokehPass.renderToScreen = true;
    postprocessing.composer = composer;
    postprocessing.stela = stelaEffect;
    
    //Extra Components
    mesh = new THREE.HCloud(4);
    scene.add(mesh);
  }

  /**
   * Animate Engine Objects.
   */
  function animate() {
    mesh.rotation.y = clock.getElapsedTime() * 0.015;
    mesh.material.uniforms.time.value = 0.015 * clock.getElapsedTime();
    postprocessing.stela.uniforms.time.value = clock.getElapsedTime();
    postprocessing.composer.render();
    requestAnimationFrame(animate);
  }

  /**
   * Display GUI Controls.
   */
  function debug() {
    var debugContainer = document.getElementById("debug");
    var gui = new dat.GUI({
        autoPlace: false
      }),
      guiData = {
        h: 4
      },
      guiControl = gui.add(guiData, 'h', 2, 10).step(1);

    guiControl.onFinishChange(function(value) {
      scene.remove(mesh);
      mesh = new THREE.HCloud(value);
      scene.add(mesh);
    });
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.bottom = '-28px';
    gui.domElement.style.left = "0px";
    debugContainer.appendChild(gui.domElement);
  }

  //Start App
  start();
  animate();
  debug();
})(window, THREE);
