// main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Intro Loading Logic ---
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    const body = document.body;
    
    // Intro Typing Animation
    const introText = "당신이 당연하게 누리는 자유와 주체성은 지금 안전합니까?";
    const typingEl = document.getElementById('intro-typing');
    let typingInterval;
    
    function startIntro() {
        body.classList.add('locked-scroll');
        introOverlay.classList.remove('hidden', 'slide-up');
        mainContent.style.opacity = '0';
        typingEl.innerHTML = '';
        
        let i = 0;
        typingInterval = setInterval(() => {
            if (i < introText.length) {
                typingEl.innerHTML += introText.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);
    }
    
    function closeIntro() {
        clearInterval(typingInterval);
        introOverlay.classList.add('slide-up');
        setTimeout(() => {
            introOverlay.classList.add('hidden');
            body.classList.remove('locked-scroll');
            mainContent.style.opacity = '1';
        }, 800);
    }

    // Start intro on initial load
    startIntro();
    
    // Any key or click to close intro
    document.addEventListener('keydown', (e) => {
        if(!introOverlay.classList.contains('hidden') && !introOverlay.classList.contains('slide-up')) {
            closeIntro();
        }
    });
    introOverlay.addEventListener('click', () => {
        if(!introOverlay.classList.contains('slide-up')) {
            closeIntro();
        }
    });

    // --- 2. Navigation / Menu Logic ---
    const menuBtn = document.getElementById('menu-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
    });

    const menuItems = dropdownMenu.querySelectorAll('li');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            gsap.to(window, { duration: 1, scrollTo: { y: targetId, offsetY: 80 }, ease: "power3.inOut" });
        });
    });

    // UP Button
    const btnUp = document.getElementById('btn-up');
    if(btnUp) {
        btnUp.addEventListener('click', () => {
            gsap.to(window, { duration: 1, scrollTo: 0, ease: "power3.inOut" });
        });
    }

    // --- 3. Outro / Exit Logic ---
    const btnShutdown = document.getElementById('btn-shutdown');
    const outroOverlay = document.getElementById('outro-overlay');
    const tvOff = document.getElementById('tv-off');
    const restartScreen = document.getElementById('restart-screen');
    const btnRestart = document.getElementById('btn-restart');
    
    const outroText = "모든 것을 의심하라.\n빅브라더는 당신을 지켜보고 있다.";
    const outroTypingEl = document.getElementById('outro-typing');
    let outroTypingInterval;

    btnShutdown.addEventListener('click', () => {
        // Trigger Outro
        body.classList.add('locked-scroll');
        outroOverlay.classList.remove('hidden');
        tvOff.classList.remove('hidden');
        tvOff.classList.add('animate');
        
        // Show restart screen after animation and start typing
        setTimeout(() => {
            restartScreen.classList.remove('hidden');
            outroTypingEl.innerHTML = '';
            btnRestart.classList.add('hidden'); // hide until typed
            
            let i = 0;
            outroTypingInterval = setInterval(() => {
                if (i < outroText.length) {
                    let char = outroText.charAt(i);
                    if(char === '\n') {
                        outroTypingEl.innerHTML += '<br>';
                    } else {
                        outroTypingEl.innerHTML += char;
                    }
                    i++;
                } else {
                    clearInterval(outroTypingInterval);
                    setTimeout(() => {
                        btnRestart.classList.remove('hidden');
                    }, 500);
                }
            }, 100);

        }, 1000);
    });

    btnRestart.addEventListener('click', () => {
        // Reset state and restart intro
        restartScreen.classList.add('hidden');
        tvOff.classList.remove('animate');
        tvOff.classList.add('hidden');
        outroOverlay.classList.add('hidden');
        outroTypingEl.innerHTML = '';
        btnRestart.classList.add('hidden');
        
        window.scrollTo(0, 0); // Scroll to top instantly
        startIntro(); // Restart the intro sequence
    });


    // --- 4. GSAP Scroll Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Key Message (Slogans)
    const slogans = gsap.utils.toArray('.slogan');
    slogans.forEach((slogan, index) => {
        gsap.to(slogan, {
            scrollTrigger: {
                trigger: '#message',
                start: 'top 80%',
                end: 'bottom 60%',
                scrub: 1
            },
            opacity: 1,
            y: 0,
            delay: index * 0.2
        });
    });

    // --- 5. Eye tracking mouse ---
    const eyeContainer = document.getElementById('eye-container');
    const pupil = document.querySelector('.pupil');
    
    // 항상 눈 표시
    eyeContainer.classList.remove('hidden');
    
    document.addEventListener('mousemove', (e) => {
        const eyeRect = eyeContainer.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        
        // Limit distance so pupil stays inside the iris (max radius offset ~10)
        const distance = Math.min(8, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) * 0.05);
        
        const pupilX = 50 + distance * Math.cos(angle);
        const pupilY = 30 + distance * Math.sin(angle);
        
        pupil.setAttribute('cx', pupilX);
        pupil.setAttribute('cy', pupilY);
    });

    // --- 6. Diary Interaction ---
    const diaryInput = document.getElementById('diary-input');
    const forbiddenWords = ['자유', '평화', '혁명', 'freedom', 'peace', 'revolution'];
    
    diaryInput.addEventListener('input', (e) => {
        let text = diaryInput.value;
        let detected = false;
        
        forbiddenWords.forEach(word => {
            if (text.includes(word)) {
                detected = true;
                setTimeout(() => {
                    let currentVal = diaryInput.value;
                    if(currentVal.endsWith(word)) {
                       let backspaceInterval = setInterval(() => {
                           if(diaryInput.value.length > currentVal.length - word.length) {
                               diaryInput.value = diaryInput.value.slice(0, -1);
                           } else {
                               clearInterval(backspaceInterval);
                               createWinPopup("Thought Police", "Thoughtcrime does not entail death: thoughtcrime IS death.", true);
                           }
                       }, 50);
                    }
                }, 500);
            }
        });
    });

    // --- 7. Pyramid / Class Nodes ---
    const classNodes = document.querySelectorAll('.class-node');
    const classData = {
        'inner': { title: 'Inner Party (내부당원 2%)', desc: '최상위 지배 계급, 빅브라더. 물질적 특권이 있으나 텔레스크린으로 가장 철저히 감시받음.' },
        'outer': { title: 'Outer Party (외부당원 13%)', desc: '당의 행정, 검열, 프로파간다 담당. 윈스턴 소속. 가장 가혹한 감시 대상이며 정서적 고립 상태.' },
        'proles': { title: 'Proles (프롤 85%)', desc: '하층 노동자 계급. "동물과 같다". 사상 교육이 없어 사상의 자유가 역설적으로 존재. 방치됨.' }
    };

    classNodes.forEach(node => {
        node.addEventListener('click', () => {
            const data = classData[node.dataset.class];
            createWinPopup(data.title, data.desc);
        });
    });

    // --- 8. Telescreen Hate & AI Chat ---
    const btnHate = document.getElementById('btn-hate');
    const telescreenWindow = document.querySelector('.telescreen-window');
    const chatMessages = document.getElementById('chat-messages');
    
    const mockChats = [
        "빅브라더를 찬양하라!",
        "사상경찰에게 신고했습니다.",
        "오세아니아 만세!",
        "오늘 배급량이 늘었다는 진리부의 발표입니다.",
        "2분 증오 시간에 늦지 마십시오.",
        "불순한 생각이 감지되었습니다."
    ];

    setInterval(() => {
        if(mainContent.style.opacity === '1') {
            const div = document.createElement('div');
            div.className = 'chat-msg';
            div.innerHTML = `<span class="username">Citizen_${Math.floor(Math.random()*9000)+1000}:</span> ${mockChats[Math.floor(Math.random()*mockChats.length)]}`;
            chatMessages.appendChild(div);
            if(chatMessages.children.length > 20) chatMessages.removeChild(chatMessages.firstChild);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 2000);

    btnHate.addEventListener('click', () => {
        telescreenWindow.classList.add('shake');
        setTimeout(() => telescreenWindow.classList.remove('shake'), 500);
        
        for(let i=0; i<5; i++) {
            setTimeout(() => {
                createWinPopup("ERROR", "빅브라더를 찬양하라!", true, Math.random() * 80 + 10, Math.random() * 80 + 10);
            }, i * 200);
        }
    });

    // Chat input logic
    const chatInput = document.getElementById('chat-input');
    const btnChatSend = document.getElementById('btn-chat-send');
    
    function sendChat() {
        const text = chatInput.value.trim();
        if(!text) return;
        
        // Censor text if it contains forbidden words, or always censor for dystopia feel
        const censoredText = text.replace(/[가-힣a-zA-Z]/g, '■');
        
        const div = document.createElement('div');
        div.className = 'chat-msg';
        div.innerHTML = `<span class="username" style="color:var(--win-red);">Winston_Smith:</span> ${censoredText}`;
        chatMessages.appendChild(div);
        
        if(chatMessages.children.length > 20) chatMessages.removeChild(chatMessages.firstChild);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Immediate AI reply
        setTimeout(() => {
            const reply = document.createElement('div');
            reply.className = 'chat-msg';
            reply.innerHTML = `<span class="username" style="color:var(--win-border);">SYSTEM:</span> 귀하의 발언은 통제되었습니다.`;
            chatMessages.appendChild(reply);
            if(chatMessages.children.length > 20) chatMessages.removeChild(chatMessages.firstChild);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
    }
    
    btnChatSend.addEventListener('click', sendChat);
    chatInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') sendChat();
    });

    // --- 9. 3D Book Setup (Three.js) ---
    function init3DBook() {
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Simple Book Geometry (Box)
        const geometry = new THREE.BoxGeometry(3, 4.5, 0.5);
        
        // Create retro texture programmatically via canvas
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#d32f2f'; // modern red cover
        ctx.fillRect(0,0,256,512);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px NeoDunggeunmo, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('1 9 8 4', 128, 100);
        ctx.font = '20px NeoDunggeunmo, sans-serif';
        ctx.fillText('George Orwell', 128, 450);
        
        const texture = new THREE.CanvasTexture(canvas);
        const materialCover = new THREE.MeshLambertMaterial({ map: texture });
        const materialPages = new THREE.MeshLambertMaterial({ color: 0xffffff });
        
        const materials = [
            materialPages, // right
            materialCover, // left (spine)
            materialPages, // top
            materialPages, // bottom
            materialCover, // front
            materialCover  // back
        ];
        
        const book = new THREE.Mesh(geometry, materials);
        scene.add(book);
        
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5).normalize();
        scene.add(light);
        
        const ambientLight = new THREE.AmbientLight(0x606060);
        scene.add(ambientLight);
        
        camera.position.z = 7;
        
        function animateBook() {
            requestAnimationFrame(animateBook);
            book.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animateBook();

        // Handle resize
        window.addEventListener('resize', () => {
            if(container.clientWidth > 0) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        });
    }
    
    // Init book via intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                init3DBook();
                observer.disconnect();
            }
        });
    });
    observer.observe(document.getElementById('book'));


    // --- Helper: Create Windows Popup ---
    function createWinPopup(title, text, isError = false, topPos = 50, leftPos = 50) {
        const container = document.getElementById('popup-container');
        const popup = document.createElement('div');
        popup.className = 'popup-window win-window';
        popup.style.top = topPos + '%';
        popup.style.left = leftPos + '%';
        
        popup.innerHTML = `
            <div class="win-titlebar" style="background: ${isError ? 'var(--win-red)' : 'var(--win-blue)'}">
                <div class="win-title">${title}</div>
                <div class="win-controls"><button onclick="this.closest('.popup-window').remove()">X</button></div>
            </div>
            <div class="win-content" style="padding: 20px;">
                <div class="popup-content">
                    <div class="popup-icon">${isError ? '⚠️' : 'ℹ️'}</div>
                    <div class="popup-text">
                        <h3>${isError ? 'WARNING' : 'INFO'}</h3>
                        <p>${text}</p>
                    </div>
                </div>
                <div class="popup-btn-wrap">
                    <button class="popup-btn" onclick="this.closest('.popup-window').remove()">OK</button>
                </div>
            </div>
        `;
        container.appendChild(popup);
    }

    // --- 10. Win Buttons (Close) ---
    document.querySelectorAll('.win-btn-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const win = e.target.closest('.win-window');
            if(win) {
                win.style.display = 'none';
                createWinPopup("SYSTEM ERROR", "창을 강제로 닫을 수 없습니다. 감시가 진행 중입니다.", true, Math.random() * 50 + 20, Math.random() * 50 + 20);
                setTimeout(() => {
                    win.style.display = 'block';
                }, 2000);
            }
        });
    });

    // --- 11. Pyramid Click Logic ---
    const pyramidLayers = document.querySelectorAll('.tri-layer');
    pyramidLayers.forEach(layer => {
        layer.addEventListener('click', () => {
            layer.classList.add('active');
            setTimeout(() => {
                layer.classList.remove('active');
            }, 1000);
        });
    });

});
