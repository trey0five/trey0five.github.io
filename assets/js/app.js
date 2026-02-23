/* ==============================================
   TORREY MUNROE - DevOps & Cloud Engineer Portfolio
   Vanilla JS - No dependencies
   ============================================== */

(function () {
    'use strict';

    /* ==============================================
       MODULE 1: Theme Manager
       ============================================== */
    const ThemeManager = {
        init() {
            const toggle = document.getElementById('theme-toggle');
            const stored = localStorage.getItem('theme');

            // Apply stored theme or default to dark
            if (stored) {
                document.documentElement.setAttribute('data-theme', stored);
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }

            if (toggle) {
                toggle.addEventListener('click', () => this.toggle());
            }
        },

        toggle() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        },

        get() {
            return document.documentElement.getAttribute('data-theme') || 'light';
        }
    };

    /* ==============================================
       MODULE 2: Terminal Animation
       ============================================== */
    const TerminalAnimation = {
        commands: [
            { prompt: '$ ', text: 'kubectl get pods --all-namespaces', delay: 35 },
            { output: 'NAMESPACE     NAME                      READY   STATUS    AGE' },
            { output: 'production    api-server-7d8f9b6c4      1/1     Running   24h' },
            { output: 'production    web-frontend-5c8d4f2      1/1     Running   24h' },
            { prompt: '$ ', text: 'docker ps --format "table {{.Names}}\\t{{.Status}}"', delay: 30 },
            { output: 'NAMES              STATUS' },
            { output: 'nginx-proxy        Up 3 hours' },
            { output: 'redis-cache        Up 3 hours' },
            { prompt: '$ ', text: 'terraform plan -out=deploy.tfplan', delay: 30 },
            { output: 'Plan: 3 to add, 0 to change, 0 to destroy.' },
            { prompt: '$ ', text: 'aws s3 ls s3://prod-artifacts/', delay: 35 },
            { output: '2026-02-23 09:00  deployment-v2.3.1/' },
            { prompt: '$ ', text: 'git push origin main && echo "Deployed!"', delay: 30 },
            { output: 'Deployed! ✓' },
            { prompt: '$ ', text: '', cursor: true }
        ],

        init() {
            const terminal = document.getElementById('terminal');
            if (!terminal) return;

            // Start typing after a small delay
            setTimeout(() => this.runSequence(terminal, 0), 800);
        },

        async runSequence(container, index) {
            if (index >= this.commands.length) return;

            const cmd = this.commands[index];
            const line = document.createElement('div');
            line.className = 'terminal__line';

            if (cmd.prompt !== undefined) {
                // It's a command to type
                const promptSpan = document.createElement('span');
                promptSpan.className = 'terminal__prompt';
                promptSpan.textContent = cmd.prompt;
                line.appendChild(promptSpan);

                const textSpan = document.createElement('span');
                line.appendChild(textSpan);
                container.appendChild(line);

                // Scroll terminal down
                container.scrollTop = container.scrollHeight;

                if (cmd.cursor && !cmd.text) {
                    // Final cursor
                    const cursor = document.createElement('span');
                    cursor.className = 'terminal__cursor';
                    line.appendChild(cursor);
                    return;
                }

                // Type character by character
                await this.typeText(textSpan, cmd.text, cmd.delay || 40);

                // Small pause after command
                await this.sleep(300);
                this.runSequence(container, index + 1);

            } else if (cmd.output !== undefined) {
                // It's output - show immediately
                line.className = 'terminal__line terminal__output';
                line.textContent = cmd.output;
                container.appendChild(line);
                container.scrollTop = container.scrollHeight;

                await this.sleep(80);
                this.runSequence(container, index + 1);
            }
        },

        typeText(element, text, delay) {
            return new Promise((resolve) => {
                let i = 0;
                const interval = setInterval(() => {
                    if (i < text.length) {
                        element.textContent += text[i];
                        i++;
                    } else {
                        clearInterval(interval);
                        resolve();
                    }
                }, delay);
            });
        },

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    /* ==============================================
       MODULE 3: Scroll Reveal (Intersection Observer)
       ============================================== */
    const ScrollReveal = {
        init() {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduced) {
                // Show everything immediately
                document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
                    el.classList.add('revealed');
                });
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.dataset.delay || 0);
                        setTimeout(() => {
                            entry.target.classList.add('revealed');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
                observer.observe(el);
            });
        }
    };

    /* ==============================================
       MODULE 4: Skill Bar Animations
       ============================================== */
    const SkillBars = {
        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const level = entry.target.dataset.level;
                        entry.target.style.setProperty('--skill-level', level + '%');
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            document.querySelectorAll('.skill-bar').forEach(el => {
                observer.observe(el);
            });
        }
    };

    /* ==============================================
       MODULE 5: 3D Tilt Effect
       ============================================== */
    const TiltEffect = {
        init() {
            // Only on non-touch devices
            if (window.matchMedia('(hover: none)').matches) return;

            document.querySelectorAll('[data-tilt]').forEach(el => {
                const glassEl = el.querySelector('[class*="__glass"]') || el;

                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -6;
                    const rotateY = ((x - centerX) / centerX) * 6;

                    glassEl.style.transform =
                        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                    glassEl.style.boxShadow =
                        `${-rotateY * 2}px ${rotateX * 2}px 30px var(--color-shadow-lg)`;
                });

                el.addEventListener('mouseleave', () => {
                    glassEl.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                    glassEl.style.boxShadow = '';
                    glassEl.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
                    setTimeout(() => {
                        glassEl.style.transition = '';
                    }, 500);
                });

                el.addEventListener('mouseenter', () => {
                    glassEl.style.transition = 'none';
                });
            });
        }
    };

    /* ==============================================
       MODULE 6: Custom Cursor
       ============================================== */
    const CustomCursor = {
        init() {
            if (window.matchMedia('(hover: none)').matches) return;
            if (window.matchMedia('(pointer: coarse)').matches) return;

            const cursor = document.querySelector('.cursor');
            const dot = document.querySelector('.cursor__dot');
            const ring = document.querySelector('.cursor__ring');

            if (!dot || !ring || !cursor) return;

            let mouseX = -100, mouseY = -100;
            let ringX = -100, ringY = -100;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dot.style.left = mouseX + 'px';
                dot.style.top = mouseY + 'px';
            });

            // Smooth ring follow with lerp
            const animateRing = () => {
                ringX += (mouseX - ringX) * 0.12;
                ringY += (mouseY - ringY) * 0.12;
                ring.style.left = ringX + 'px';
                ring.style.top = ringY + 'px';
                requestAnimationFrame(animateRing);
            };
            animateRing();

            // Grow on interactive elements
            const interactiveSelectors = 'a, button, .magnetic, input, textarea, [data-tilt]';
            document.addEventListener('mouseover', (e) => {
                if (e.target.closest(interactiveSelectors)) {
                    cursor.classList.add('cursor--hover');
                }
            });
            document.addEventListener('mouseout', (e) => {
                if (e.target.closest(interactiveSelectors)) {
                    cursor.classList.remove('cursor--hover');
                }
            });

            // Hide when mouse leaves window
            document.addEventListener('mouseleave', () => {
                dot.style.opacity = '0';
                ring.style.opacity = '0';
            });
            document.addEventListener('mouseenter', () => {
                dot.style.opacity = '1';
                ring.style.opacity = '1';
            });
        }
    };

    /* ==============================================
       MODULE 7: Magnetic Button Effect
       ============================================== */
    const MagneticButtons = {
        init() {
            if (window.matchMedia('(hover: none)').matches) return;

            document.querySelectorAll('.magnetic').forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translate(0, 0)';
                    btn.style.transition = 'transform 0.4s ease';
                    setTimeout(() => {
                        btn.style.transition = '';
                    }, 400);
                });

                btn.addEventListener('mouseenter', () => {
                    btn.style.transition = 'none';
                });
            });
        }
    };

    /* ==============================================
       MODULE 8: Navigation
       ============================================== */
    const Navigation = {
        lastScrollY: 0,
        ticking: false,

        init() {
            const nav = document.getElementById('nav');
            const mobileToggle = document.getElementById('mobile-nav-toggle');
            const mobileNav = document.getElementById('mobile-nav');
            const overlay = document.getElementById('mobile-nav-overlay');

            if (!nav) return;

            // Hide/show nav on scroll (throttled with rAF)
            window.addEventListener('scroll', () => {
                if (!this.ticking) {
                    requestAnimationFrame(() => {
                        this.handleScroll(nav);
                        this.updateActiveLink();
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            });

            // Mobile nav toggle
            if (mobileToggle && mobileNav) {
                mobileToggle.addEventListener('click', () => {
                    const isOpen = mobileNav.classList.toggle('open');
                    mobileToggle.classList.toggle('active');
                    if (overlay) overlay.classList.toggle('visible', isOpen);
                    document.body.style.overflow = isOpen ? 'hidden' : '';
                });

                // Close on overlay click
                if (overlay) {
                    overlay.addEventListener('click', () => this.closeMobileNav(mobileToggle, mobileNav, overlay));
                }

                // Close mobile nav when link clicked
                mobileNav.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        this.closeMobileNav(mobileToggle, mobileNav, overlay);
                    });
                });
            }

            // Smooth scroll for all anchor links
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href === '#') return;
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        },

        handleScroll(nav) {
            const currentY = window.scrollY;
            if (currentY > this.lastScrollY && currentY > 120) {
                nav.classList.add('nav--hidden');
            } else {
                nav.classList.remove('nav--hidden');
            }
            this.lastScrollY = currentY;
        },

        closeMobileNav(toggle, nav, overlay) {
            nav.classList.remove('open');
            toggle.classList.remove('active');
            if (overlay) overlay.classList.remove('visible');
            document.body.style.overflow = '';
        },

        updateActiveLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollY = window.scrollY + 150;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                const link = document.querySelector(`.nav__link[href="#${id}"]`);
                if (link) {
                    if (scrollY >= top && scrollY < top + height) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                }
            });
        }
    };

    /* ==============================================
       MODULE 9: Particle Background
       ============================================== */
    const ParticleBackground = {
        particles: [],
        canvas: null,
        ctx: null,
        animId: null,

        init() {
            this.canvas = document.getElementById('particle-canvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.resize();

            // Adjust count based on screen size
            const count = window.innerWidth < 768 ? 25 : 50;

            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.4 + 0.1
                });
            }

            window.addEventListener('resize', () => this.resize());
            this.draw();
        },

        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        draw() {
            if (!this.ctx || !this.canvas) return;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const isDark = ThemeManager.get() === 'dark';
            const color = isDark ? '52, 211, 153' : '16, 185, 129';
            const maxDist = 150;

            this.particles.forEach((p, i) => {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

                // Draw dot
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
                this.ctx.fill();

                // Connect nearby particles
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const dx = p2.x - p.x;
                    const dy = p2.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(${color}, ${0.08 * (1 - dist / maxDist)})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            });

            this.animId = requestAnimationFrame(() => this.draw());
        }
    };

    /* ==============================================
       MODULE 10: Timeline Scroll Progress (JS Fallback)
       ============================================== */
    const TimelineProgress = {
        init() {
            // Only use JS fallback if CSS scroll-driven animations not supported
            if (CSS.supports && CSS.supports('animation-timeline: scroll()')) return;

            const progress = document.querySelector('.timeline__progress');
            const timeline = document.querySelector('.timeline');
            if (!progress || !timeline) return;

            const update = () => {
                const rect = timeline.getBoundingClientRect();
                const vh = window.innerHeight;
                const totalHeight = timeline.offsetHeight;
                const scrolled = vh - rect.top;
                const percent = Math.max(0, Math.min(100, (scrolled / totalHeight) * 100));
                progress.style.height = percent + '%';
            };

            window.addEventListener('scroll', () => {
                requestAnimationFrame(update);
            });
        }
    };

    /* ==============================================
       INITIALIZATION
       ============================================== */
    function init() {
        ThemeManager.init();
        Navigation.init();
        ScrollReveal.init();
        SkillBars.init();
        TerminalAnimation.init();
        TiltEffect.init();
        CustomCursor.init();
        MagneticButtons.init();
        ParticleBackground.init();
        TimelineProgress.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
