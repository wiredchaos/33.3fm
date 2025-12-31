import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Info, Play, Zap, Music } from 'lucide-react';

export default function Interactive3DStudio({ onObjectClick }) {
  const mountRef = useRef(null);
  const [hoveredObject, setHoveredObject] = useState(null);
  const [clickedObject, setClickedObject] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(6, 3, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Interactive objects array
    const interactiveObjects = [];

    // Create clickable microphone
    const micGroup = new THREE.Group();
    micGroup.userData = { 
      name: 'Professional Microphone',
      description: 'Neumann U87 - Industry standard condenser mic',
      action: 'record'
    };

    const micBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.35, 32),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.8, roughness: 0.4 })
    );
    micBody.rotation.z = Math.PI / 2;
    micGroup.add(micBody);

    const micGrille = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.9, roughness: 0.6 })
    );
    micGrille.position.x = 0.18;
    micGroup.add(micGrille);

    micGroup.position.set(-3, 2, 0);
    scene.add(micGroup);
    interactiveObjects.push(micGroup);

    // Create clickable mixing console button
    const consoleButton = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.05, 32),
      new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.3
      })
    );
    consoleButton.rotation.x = Math.PI / 2;
    consoleButton.position.set(3, 1.2, 0);
    consoleButton.userData = {
      name: 'Record Button',
      description: 'Start/Stop recording session',
      action: 'toggle_record'
    };
    scene.add(consoleButton);
    interactiveObjects.push(consoleButton);

    // Create clickable speaker
    const speakerGroup = new THREE.Group();
    speakerGroup.userData = {
      name: 'Studio Monitor',
      description: 'KRK Rokit 8 - Reference quality',
      action: 'play_audio'
    };

    const speakerBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.6, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 })
    );
    speakerGroup.add(speakerBox);

    const woofer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 })
    );
    woofer.rotation.x = Math.PI / 2;
    woofer.position.z = 0.18;
    speakerGroup.add(woofer);

    speakerGroup.position.set(4, 1.6, -0.5);
    scene.add(speakerGroup);
    interactiveObjects.push(speakerGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0xffe8d6, 1.2, 20);
    keyLight.position.set(-3, 3.8, 0);
    scene.add(keyLight);

    // Mouse interaction
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        const object = intersects[0].object.parent || intersects[0].object;
        if (object.userData.name) {
          setHoveredObject(object.userData);
          document.body.style.cursor = 'pointer';
          
          // Highlight effect
          if (object.children.length > 0) {
            object.children.forEach(child => {
              if (child.material) {
                child.material.emissiveIntensity = 0.8;
              }
            });
          } else if (object.material) {
            object.material.emissiveIntensity = 0.8;
          }
        }
      } else {
        setHoveredObject(null);
        document.body.style.cursor = 'default';
        
        // Reset highlights
        interactiveObjects.forEach(obj => {
          if (obj.children.length > 0) {
            obj.children.forEach(child => {
              if (child.material && child.material.emissive) {
                child.material.emissiveIntensity = 0.3;
              }
            });
          } else if (obj.material && obj.material.emissive) {
            obj.material.emissiveIntensity = 0.3;
          }
        });
      }
    };

    const onClick = () => {
      if (hoveredObject) {
        setClickedObject(hoveredObject);
        if (onObjectClick) {
          onObjectClick(hoveredObject);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      camera.position.x = 6 + Math.sin(time * 0.08) * 2;
      camera.position.y = 3 + Math.sin(time * 0.1) * 0.5;
      camera.lookAt(0, 2, 0);

      // Animate interactive objects
      if (hoveredObject) {
        interactiveObjects.forEach(obj => {
          if (obj.userData.name === hoveredObject.name) {
            obj.position.y += Math.sin(time * 5) * 0.005;
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [hoveredObject, onObjectClick]);

  return (
    <>
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Hover tooltip */}
      {hoveredObject && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="backdrop-blur-md bg-black/80 border border-cyan-400/50 rounded-xl p-4 min-w-64">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-medium">{hoveredObject.name}</h3>
            </div>
            <p className="text-xs text-white/60">{hoveredObject.description}</p>
            <div className="mt-2 text-xs text-cyan-400">Click to interact</div>
          </div>
        </div>
      )}

      {/* Click info */}
      {clickedObject && (
        <div className="fixed top-24 right-6 z-20 pointer-events-auto">
          <div className="backdrop-blur-md bg-black/80 border border-cyan-400/50 rounded-xl p-4 w-80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-medium">{clickedObject.name}</h3>
              </div>
              <button
                onClick={() => setClickedObject(null)}
                className="text-white/60 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-white/80 mb-3">{clickedObject.description}</p>
            <div className="flex gap-2">
              {clickedObject.action === 'record' && (
                <button className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Recording
                </button>
              )}
              {clickedObject.action === 'play_audio' && (
                <button className="flex-1 px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-500 text-black text-sm flex items-center justify-center gap-2">
                  <Music className="w-4 h-4" />
                  Play Test Sound
                </button>
              )}
              {clickedObject.action === 'toggle_record' && (
                <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-cyan-400 hover:from-red-600 hover:to-cyan-500 text-white text-sm">
                  Toggle Recording
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}