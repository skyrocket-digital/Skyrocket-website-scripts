<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/js/loaders/GLTFLoader.js"></script>
<script>
 /* document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Configure Renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    document.body.appendChild(renderer.domElement);

    // Position the Camera
    camera.position.z = 5;

    // Add Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    let model; // Declare model variable for global access
    const mouse = { x: 0, y: 0 }; // Track mouse position
    let isDragging = false;
    let previousTouch = { x: 0, y: 0 }; // Track the previous touch position

    // Load the 3D Model using GLTFLoader
    const loader = new THREE.GLTFLoader();
    loader.load(
    	'https://cdn.jsdelivr.net/gh/skyrocket-digital/Skyrocket-website-scripts@main/models/skyrocket_creative.glb',
      //'https://cdn.jsdelivr.net/gh/skyrocket-digital/Skyrocket-website-scripts@main/earth_globe_hologram_2mb_looping_animation.glb',
      (gltf) => {
        // Add the loaded model to the scene
        model = gltf.scene;
        model.scale.set(1, 1, 1); // Scale the model (adjust as needed)
        scene.add(model);

        // Start rendering the scene
        animate();
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
      }
    );

    // Track mouse movement for desktop
    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Add touch event listeners for mobile devices
    window.addEventListener('touchstart', (event) => {
      if (event.touches.length === 1) {
        isDragging = true;
        previousTouch.x = event.touches[0].clientX;
        previousTouch.y = event.touches[0].clientY;
      }
    });

    window.addEventListener('touchmove', (event) => {
      if (isDragging && model && event.touches.length === 1) {
        const currentTouch = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };

        const deltaX = currentTouch.x - previousTouch.x;
        const deltaY = currentTouch.y - previousTouch.y;

        model.rotation.y += deltaX * 0.005; // Adjust rotation sensitivity
        model.rotation.x += deltaY * 0.005; // Adjust rotation sensitivity

        previousTouch.x = currentTouch.x;
        previousTouch.y = currentTouch.y;
      }
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    // Render Loop
    function animate() {
      requestAnimationFrame(animate);

      // Apply mouse movement to model's rotation (desktop interaction)
      if (model) {
        model.rotation.y += (mouse.x * Math.PI - model.rotation.y) * 0.1; // Smooth Y rotation
        model.rotation.x += (mouse.y * Math.PI * 0.5 - model.rotation.x) * 0.1; // Smooth X rotation
      }

      renderer.render(scene, camera);
    }
  });
  */
  
  document.addEventListener('DOMContentLoaded', () => {
  // Initialize the Three.js Scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  // Configure Renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0); // Transparent background
  document.body.appendChild(renderer.domElement);

  // Position the Camera
  camera.position.z = 5;

  // Add Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft ambient light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Additional Point Light to enhance reflections and highlights
  const pointLight = new THREE.PointLight(0xffffff, 0.2);
  pointLight.position.set(0, 5, 5);
  scene.add(pointLight);
 
  // Additional blue light close to the white light
  const blueLight = new THREE.PointLight(0x0000ff, 0.3);
  blueLight.position.set(0, 2.5, 2.5); // Slightly offset from the white light
  scene.add(blueLight);
  
  // Add dim red light
  const redLight = new THREE.PointLight(0xff0000, 0.3);
  redLight.position.set(-5, 0, 5);
  scene.add(redLight);

  // Add dim purple light
  const purpleLight = new THREE.PointLight(0x800080, 0.3);
  purpleLight.position.set(5, 0, -5);
  scene.add(purpleLight);
  
  const refractionMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    refractionRatio: 0.95
  });

  let model; // Global model variable
  const mouse = { x: 0, y: 0 }; // Mouse position tracking
  let isDragging = false;
  let previousTouch = { x: 0, y: 0 };


  // Load the 3D Model using GLTFLoader
  const loader = new THREE.GLTFLoader();
  loader.load(
    'https://cdn.jsdelivr.net/gh/skyrocket-digital/Skyrocket-website-scripts@main/models/skyrocket_creative.glb',
    (gltf) => {
      model = gltf.scene;
      model.scale.set(1, 1, 1); // Adjust model scale as needed

      let texture = new THREE.CanvasTexture();
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.x = 10;
      texture.repeat.y = 10;
              
      // Traverse the model and apply the refraction material to each mesh
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhysicalMaterial({
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            metalness: 0.9,
            roughness: 0.5,
            color: '#e1e1e1',
            transparent: true,
            opacity: 0.8, 
            normalScale: new THREE.Vector2(0.15,0.15)
          });
          //child.material = refractionMaterial;
        }
      });

      scene.add(model);
      animate();
    },
    undefined,
    (error) => {
      console.error('An error occurred while loading the model:', error);
    }
  );

  // Track mouse movement for desktop
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Touch event listeners for mobile devices
  window.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
      isDragging = true;
      previousTouch.x = event.touches[0].clientX;
      previousTouch.y = event.touches[0].clientY;
    }
  });

  window.addEventListener('touchmove', (event) => {
    if (isDragging && model && event.touches.length === 1) {
      const currentTouch = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };

      const deltaX = currentTouch.x - previousTouch.x;
      const deltaY = currentTouch.y - previousTouch.y;

      model.rotation.y += deltaX * 0.005; // Adjust rotation sensitivity
      model.rotation.x += deltaY * 0.005; // Adjust rotation sensitivity

      previousTouch.x = currentTouch.x;
      previousTouch.y = currentTouch.y;
    }
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Handle Window Resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);

    // Apply mouse movement to model's rotation (desktop interaction)
    if (model) {
      model.rotation.y += (mouse.x * Math.PI - model.rotation.y) * 0.1;
      model.rotation.x += (mouse.y * Math.PI * 0.5 - model.rotation.x) * 0.1;
    }

    renderer.render(scene, camera);
  }
});



</script>
