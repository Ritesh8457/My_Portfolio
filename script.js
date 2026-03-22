// ==========================================
// Navigation & Mobile Menu
// ==========================================
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu on click
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.remove('fa-times');
        hamburger.querySelector('i').classList.add('fa-bars');
    });
});

// ==========================================
// 3D TAG CLOUD (Skills)
// ==========================================
const myTags = [
    'Python', 'SQL', 'Machine Learning', 
    'Power BI', 'Deep Learning', 'Data Analysis',
    'PYSpark', 'Predictive Modeling', 'Git',
    'Excel', 'XGBoost', 'Random Forest',
    'Clustering', 'SVM', 'Pandas', 'NumPy'
];

var tagCloud = TagCloud('.sphere-cloud', myTags, {
    radius: 160,
    maxSpeed: 'normal',
    initSpeed: 'slow',
    direction: 135,
    keep: true
});

// Change color of tags via interval (TagCloud builds DOM slightly delayed)
setTimeout(() => {
    const tags = document.querySelectorAll('.tagcloud--item');
    tags.forEach(tag => tag.style.color = '#00f3ff');
}, 500);

// ==========================================
// GSAP SCROLL ANIMATIONS
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Hero elements reveal on load
const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
heroTl.from(".gsap-reveal", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    delay: 0.5
});

// Scroll slide-up animations
gsap.utils.toArray(".gsap-slide-up").forEach(elem => {
    gsap.from(elem, {
        scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none none"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Scroll slide-left
gsap.utils.toArray(".gsap-slide-left").forEach(elem => {
    gsap.from(elem, {
        scrollTrigger: {
            trigger: elem,
            start: "top 85%",
        },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Scroll slide-right
gsap.utils.toArray(".gsap-slide-right").forEach(elem => {
    gsap.from(elem, {
        scrollTrigger: {
            trigger: elem,
            start: "top 85%",
        },
        x: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Animate Skill Progress Bars
gsap.utils.toArray(".progress").forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = "0%"; // reset before scroll
    
    gsap.to(bar, {
        scrollTrigger: {
            trigger: bar,
            start: "top 85%",
        },
        width: targetWidth,
        duration: 1.5,
        delay: 0.5,
        ease: "power3.out"
    });
});


// ==========================================
// THREE.JS 3D BACKGROUND (Cosmic Galaxy)
// ==========================================
// Setup Scene, Camera, Renderer
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070a13, 0.002);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 150;
camera.position.z = 150;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Galaxy Parameters
const particleCount = 2000;
const radius = 250;
const branches = 4;
const spin = 1.5;
const randomness = 0.5;
const randomnessPower = 3;

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

const colorInside = new THREE.Color(0x00f3ff); // Cyan
const colorOutside = new THREE.Color(0x8a2be2); // Purple

for(let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Position
    const r = Math.random() * radius;
    const branchAngle = (i % branches) / branches * Math.PI * 2;
    const spinAngle = r * spin;
    
    const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
    const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
    const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
    
    positions[i3    ] = Math.cos(branchAngle + spinAngle) * r + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;
    
    // Color
    const mixedColor = colorInside.clone().lerp(colorOutside, r / radius);
    colors[i3    ] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Material
const material = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
});

const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);

// Comets / Shooting Stars
const cometCount = 15;
const cometGeometry = new THREE.BufferGeometry();
const cometPositions = new Float32Array(cometCount * 3);
const cometVelocities = [];

for(let i=0; i<cometCount; i++) {
    cometPositions[i*3] = (Math.random() - 0.5) * 600;
    cometPositions[i*3+1] = Math.random() * 300;
    cometPositions[i*3+2] = (Math.random() - 0.5) * 600;
    cometVelocities.push({
        x: (Math.random() - 0.5) * 5,
        y: -Math.random() * 5 - 3, // Falling down fast
        z: (Math.random() - 0.5) * 5
    });
}
cometGeometry.setAttribute('position', new THREE.BufferAttribute(cometPositions, 3));
const cometMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.5,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
});
const comets = new THREE.Points(cometGeometry, cometMaterial);
scene.add(comets);

// Mouse interaction tracking
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates from -1 to 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

const clock = new THREE.Clock();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate Galaxy
    galaxy.rotation.y = elapsedTime * 0.05;

    // Animate Comets
    const cPositions = cometGeometry.attributes.position.array;
    for(let i=0; i<cometCount; i++) {
        cPositions[i*3] += cometVelocities[i].x;
        cPositions[i*3+1] += cometVelocities[i].y;
        cPositions[i*3+2] += cometVelocities[i].z;
        
        // Reset comet if it goes out of bounds
        if(cPositions[i*3+1] < -200) {
            cPositions[i*3] = (Math.random() - 0.5) * 600;
            cPositions[i*3+1] = Math.random() * 300 + 200;
            cPositions[i*3+2] = (Math.random() - 0.5) * 600;
        }
    }
    cometGeometry.attributes.position.needsUpdate = true;

    // Dynamic camera panning based on mouse
    camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
    camera.position.y += ((150 - mouseY * 20) - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start Animation
animate();
