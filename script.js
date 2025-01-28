// Initialize mouse position variables
let mouseX = 0;
let mouseY = 0;

// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('robot-container').appendChild(renderer.domElement);

// Mouse position for robot interaction
let targetRotationX = 0;
let targetRotationY = 0;

// Create Robot
const robot = new THREE.Group();

// Robot Body
const bodyGeometry = new THREE.BoxGeometry(2, 3, 1);
const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x00b4d8,
    shininess: 100,
    emissive: 0x00b4d8,
    emissiveIntensity: 0.2
});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
robot.add(body);

// Robot Head
const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const headMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x00b4d8,
    shininess: 100,
    emissive: 0x00b4d8,
    emissiveIntensity: 0.2
});
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.y = 2;
robot.add(head);

// Robot Arms
const armGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.4);
const armMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x00b4d8,
    shininess: 100
});
const leftArm = new THREE.Mesh(armGeometry, armMaterial);
leftArm.position.set(-1.2, 0.5, 0);
robot.add(leftArm);

const rightArm = new THREE.Mesh(armGeometry, armMaterial);
rightArm.position.set(1.2, 0.5, 0);
robot.add(rightArm);

// Add TZ Logo
const logoGeometry = new THREE.PlaneGeometry(1, 1);
const logoTexture = new THREE.TextureLoader().load('tz-logo.png');
const logoMaterial = new THREE.MeshBasicMaterial({
    map: logoTexture,
    transparent: true,
    emissive: 0x00b4d8,
    emissiveIntensity: 0.5
});
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
logo.position.set(0, 0.5, 0.51);
body.add(logo);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00b4d8, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

scene.add(robot);
camera.position.z = 5;

// Particle System Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 100,
            density: { enable: true, value_area: 800 }
        },
        color: { value: '#00b4d8' },
        shape: { type: 'circle' },
        opacity: {
            value: 0.5,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
        },
        size: {
            value: 3,
            random: true,
            anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00b4d8',
            opacity: 0.4,
            width: 1,
            shadow: { enable: true, color: '#00b4d8', blur: 5 }
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: true,
            attract: { enable: true, rotateX: 600, rotateY: 1200 }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 200,
                line_linked: {
                    opacity: 0.8,
                    color: '#00b4d8'
                }
            },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// Custom cursor with glow effect
const cursor = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Update mouse position for robot interaction
    mouseX = (e.clientX - window.innerWidth / 2) / 100;
    mouseY = (e.clientY - window.innerHeight / 2) / 100;
    
    // Highlight particles near cursor
    const particles = document.querySelectorAll('#particles-js canvas');
    particles.forEach(particle => {
        const rect = particle.getBoundingClientRect();
        const distance = Math.hypot(
            e.clientX - (rect.left + rect.width / 2),
            e.clientY - (rect.top + rect.height / 2)
        );
        if (distance < 100) {
            particle.style.filter = `brightness(1.5) blur(${(100 - distance) / 50}px)`;
        } else {
            particle.style.filter = 'none';
        }
    });
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth robot rotation
    targetRotationY += (mouseX - targetRotationY) * 0.05;
    targetRotationX += (mouseY - targetRotationX) * 0.05;
    
    robot.rotation.y = targetRotationY;
    robot.rotation.x = targetRotationX;
    
    // Add floating animation
    robot.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize time display
document.addEventListener('DOMContentLoaded', function() {
    const timeDisplay = document.querySelector('.ai-time');
    const pressButton = document.querySelector('.press-button');

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}:${seconds} - ${day}/${month}`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);

    // Press button functionality
    if (pressButton) {
        pressButton.addEventListener('click', function() {
            window.location.href = 'main.html';
        });
    }

    // Arrow controls
    const leftArrow = document.querySelector('.control-arrows.left');
    const rightArrow = document.querySelector('.control-arrows.right');

    if (leftArrow) {
        leftArrow.addEventListener('click', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => this.style.transform = 'scale(1)', 200);
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => this.style.transform = 'scale(1)', 200);
        });
    }
});
