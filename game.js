// MSK REVIEW RUNNER - Study Game 2025
// Musculoskeletal nursing review game with questions

const gameQuizQuestions = [
    { q: "A nurse is reinforcing preoperative teaching for a client scheduled for arthroscopy of the knee. Which statements should the nurse include? (Select all that apply)", category: "diagnostics", type: "sata", options: ["Apply ice packs to the area for the first 24 hours", "Keep the leg in a dependent position after surgery", "Perform isometric exercises as prescribed", "Avoid placing a cast on the surgical site", "Monitor the incision for signs of infection"], correctAnswers: ["Apply ice packs to the area for the first 24 hours", "Perform isometric exercises as prescribed", "Monitor the incision for signs of infection"], explanation: "Post-arthroscopy care includes ice packs for 24 hours, isometric exercises, and infection monitoring." },
    { q: "A nurse is preparing a client for a bone scan. Which instruction should the nurse provide?", category: "diagnostics", options: ["You will receive the radioactive injection when scanning begins", "You must remain NPO for 24 hours before the test", "You should empty your bladder before the procedure", "Radioactive precautions are needed for 72 hours after"], correctAnswer: "You should empty your bladder before the procedure", explanation: "Empty bladder promotes visualization of pelvic bones." },
    { q: "A client asks about DEXA scan results showing a T-score of -2.8. The nurse explains this indicates:", category: "diagnostics", options: ["Normal bone density", "Osteopenia", "Osteoporosis", "Severe osteomalacia"], correctAnswer: "Osteoporosis", explanation: "T-score <= -2.5 indicates osteoporosis." },
    { q: "Which client would the nurse identify as having a contraindication for electromyography (EMG)?", category: "diagnostics", options: ["A client taking metformin", "A client taking warfarin for atrial fibrillation", "A client with allergies", "A client who drinks coffee"], correctAnswer: "A client taking warfarin for atrial fibrillation", explanation: "Anticoagulants are a contraindication for EMG needles." },
    { q: "A nurse is reinforcing teaching about DEXA scans. Which information should the nurse include? (Select all that apply)", category: "diagnostics", type: "sata", options: ["Requires contrast", "Hip and spine are usual areas", "Detects osteoarthritis", "Bone pain indicates need", "Females baseline 40-49"], correctAnswers: ["Hip and spine are usual areas", "Bone pain indicates need", "Females baseline 40-49"], explanation: "DEXA scans hip/spine for density. No contrast." },
    { q: "A client is scheduled for EMG testing. Which pre-procedure instruction should the nurse provide?", category: "diagnostics", options: ["Fast for 12 hours", "Avoid smoking and caffeine for at least 3 hours", "Take muscle relaxant", "Expect sedation"], correctAnswer: "Avoid smoking and caffeine for at least 3 hours", explanation: "Avoid stimulants before EMG." },
    { q: "A nurse is caring for a client post-arthroscopy. Which nursing action is appropriate?", category: "diagnostics", options: ["Warm compresses", "Monitor neurovascular status every hour", "Immediate weight bearing", "Dependent position"], correctAnswer: "Monitor neurovascular status every hour", explanation: "Neurovascular checks are priority." },
    { q: "Following a gallium scan, which instruction should the nurse reinforce?", category: "diagnostics", options: ["Avoid pregnant women", "Increase fluid intake", "Monitor urine color", "Bed rest"], correctAnswer: "Increase fluid intake", explanation: "Fluids help excrete the radioisotope." },
    { q: "A client scheduled for MRI reports having a pacemaker. What is the priority action?", category: "diagnostics", options: ["Explain procedure", "Notify provider as this is a contraindication for MRI", "Administer sedation", "Remove jewelry"], correctAnswer: "Notify the provider as this is a contraindication for MRI", explanation: "MRI is contraindicated with pacemakers." },
    { q: "Which finding suggests a need for CT scan rather than X-ray for a fracture?", category: "diagnostics", options: ["Wrist fracture", "Possible hip or pelvic fracture", "Ankle sprain", "Finger fracture"], correctAnswer: "Possible hip or pelvic fracture", explanation: "CT is better for complex pelvic fractures." },
    { q: "A nurse is collecting data from a client scheduled for knee arthroplasty. Which findings should the nurse expect? (Select all that apply)", category: "arthroplasty", type: "sata", options: ["Pain when bearing weight", "Joint crepitus", "Skin reddened", "Swelling of the affected joint", "Limited joint motion"], correctAnswers: ["Pain when bearing weight", "Joint crepitus", "Swelling of the affected joint", "Limited joint motion"], explanation: "Expect pain, crepitus, swelling, and limited motion." },
    { q: "Which finding in a client's history is a contraindication for total joint arthroplasty?", category: "arthroplasty", options: ["Age 55 years", "History of cancer", "Previous joint replacement", "Bronchitis 2 weeks ago"], correctAnswer: "Bronchitis 2 weeks ago", explanation: "Recent infection is a contraindication due to risk of seeding." },
    { q: "A nurse is caring for a client following a total knee replacement. Which actions should the nurse take? (Select all that apply)", category: "arthroplasty", type: "sata", options: ["Check CPM settings", "Palpate dorsal pedal pulses", "Place pillow behind knee", "Request PT referral", "Apply heat"], correctAnswers: ["Check CPM settings", "Palpate dorsal pedal pulses", "Request PT referral"], explanation: "Check CPM, pulses, and PT. No pillow behind knee." },
    { q: "Which position prevents hip dislocation after total hip arthroplasty?", category: "arthroplasty", options: ["Legs adducted past midline", "Legs abducted with wedge pillow between them", "Hip flexion > 90 degrees", "Legs crossed"], correctAnswer: "Legs abducted with wedge pillow between them", explanation: "Maintain abduction with wedge pillow." },
    { q: "A nurse is providing postoperative care for a client who has a total hip arthroplasty. Which actions should the nurse take? (Select all that apply)", category: "arthroplasty", type: "sata", options: ["Provide raised toilet seat", "Low reclining chair", "Roll onto operative hip", "Use abductor pillow", "Use incentive spirometer"], correctAnswers: ["Provide raised toilet seat", "Use abductor pillow", "Use incentive spirometer"], explanation: "Raised toilet seat, abductor pillow, incentive spirometer." },
    { q: "A client 2 days post-hip replacement reports sudden severe hip pain and heard a 'pop.' The leg is shortened. What is suspected?", category: "arthroplasty", options: ["DVT", "Hip dislocation", "Fat embolism", "Infection"], correctAnswer: "Hip dislocation", explanation: "Pop, pain, shortening, rotation = dislocation." },
    { q: "Which instruction should the nurse reinforce for discharge after total hip arthroplasty? (Select all that apply)", category: "arthroplasty", type: "sata", options: ["Calf exercises every 2 hours", "Turn toes inward", "Bend at waist", "Use raised toilet seat", "Use long-handled shoehorn"], correctAnswers: ["Calf exercises every 2 hours", "Use raised toilet seat", "Use long-handled shoehorn"], explanation: "Exercises, raised seat, shoehorn. No bending >90 degrees." },
    { q: "DVT prophylaxis after total knee replacement includes which interventions?", category: "arthroplasty", options: ["Strict bed rest", "Anticoagulants, compression devices, and early ambulation", "Aspirin only", "Dependent position"], correctAnswer: "Anticoagulants, compression devices, and early ambulation", explanation: "Combination therapy is required." },
    { q: "A client asks why they must use Hibiclens soap before joint replacement surgery. The nurse explains:", category: "arthroplasty", options: ["Relaxation", "It reduces skin bacteria to prevent infection", "Removes dead skin", "Decreases pain"], correctAnswer: "It reduces skin bacteria to prevent infection", explanation: "Reduces bacterial count." },
    { q: "Which client statement indicates understanding of discharge teaching after total knee arthroplasty?", category: "arthroplasty", options: ["I can kneel to garden", "I should avoid deep-knee bends indefinitely", "Stop anticoagulants in 1 week", "No infection worry"], correctAnswer: "I should avoid deep-knee bends indefinitely", explanation: "Deep knee bends put stress on the prosthesis." },
    { q: "Which is the priority assessment immediately after total joint arthroplasty?", category: "arthroplasty", options: ["Pain level", "Neurovascular status of the operative extremity", "Mobility", "Precautions"], correctAnswer: "Neurovascular status of the operative extremity", explanation: "Circulation is priority." },
    { q: "A nurse notes bloody drainage on hip dressing. Hgb is 8.5 (down from 11.2). What should the nurse anticipate?", category: "arthroplasty", options: ["Surgical exploration", "Antifibrinolytics", "Autologous blood transfusion", "IV fluids only"], correctAnswer: "Autologous blood transfusion", explanation: "Significant blood loss/drop in Hgb may require transfusion." },
    { q: "At the scene of a traumatic amputation, which action should the nurse take first?", category: "amputations", options: ["Locate extremity", "Apply direct pressure to control hemorrhage", "Call EMS", "Ice the part"], correctAnswer: "Apply direct pressure to control hemorrhage", explanation: "Hemorrhage control is life-saving priority." },
    { q: "A client with a below-knee amputation reports burning pain in the 'missing' foot. This is:", category: "amputations", options: ["Incisional pain", "Phantom limb pain that can be treated", "Infection", "Psychological disturbance"], correctAnswer: "Phantom limb pain that can be treated", explanation: "Phantom pain is real and treatable." },
    { q: "Which intervention helps prevent hip flexion contractures after above-knee amputation?", category: "amputations", options: ["Pillows under limb", "Sitting all day", "Lie prone for 20-30 minutes several times daily", "Elevate limb indefinitely"], correctAnswer: "Have the client lie prone for 20-30 minutes several times daily", explanation: "Prone position stretches the hip flexors." },
    { q: "Which technique is correct for residual limb wrapping?", category: "amputations", options: ["Circular from proximal", "Figure-eight to prevent restriction", "Tight bandaging", "Apply once daily"], correctAnswer: "Figure-eight wrapping to prevent blood flow restriction", explanation: "Figure-eight shapes the limb without restriction." },
    { q: "Which nursing actions are appropriate post-amputation? (Select all that apply)", category: "amputations", type: "sata", options: ["Gabapentin for phantom pain", "Delay ROM", "Record drainage", "Avoid prone", "Compare pulses"], correctAnswers: ["Gabapentin for phantom pain", "Record drainage", "Compare pulses"], explanation: "Gabapentin, drainage monitoring, pulse checks." },
    { q: "A client with a new amputation refuses to look at the limb. Therapeutic response?", category: "amputations", options: ["You need to look", "I understand this is difficult. Would you like to talk about your feelings?", "You'll get used to it", "Should I cover it?"], correctAnswer: "I understand this is difficult. Would you like to talk about your feelings?", explanation: "Acknowledge feelings." },
    { q: "Which team member fits the prosthesis?", category: "amputations", options: ["PT", "OT", "Certified prosthetic orthotist", "Nurse"], correctAnswer: "Certified prosthetic orthotist", explanation: "Prosthetist fits the device." },
    { q: "When caring for a severed extremity, the nurse should:", category: "amputations", options: ["Place on ice directly", "Wrap in dry sterile gauze, Place in sealed bag, then in ice water", "Submerge in saline", "Keep warm"], correctAnswer: "Wrap in dry sterile gauze, place in sealed bag, then in ice water", explanation: "Dry gauze -> Bag -> Ice water." },
    { q: "Which finding 3 days post-amputation requires immediate notification?", category: "amputations", options: ["Phantom sensation", "Temperature 101.2°F with purulent drainage", "Mild discomfort", "Sadness"], correctAnswer: "Temperature 101.2°F (38.4°C) with purulent drainage from the incision", explanation: "Signs of infection." },
    { q: "Which pain management is used for phantom limb pain? (Select all that apply)", category: "amputations", type: "sata", options: ["Gabapentin", "TENS", "Opioids first-line", "Mirror therapy", "Massage"], correctAnswers: ["Gabapentin", "TENS", "Mirror therapy", "Massage"], explanation: "Gabapentin, TENS, mirror therapy, massage." },
    { q: "Which clients have risk factors for osteoporosis? (Select all that apply)", category: "osteoporosis", type: "sata", options: ["Prednisone 1 month", "Jogging", "Phenytoin 20 years", "Furosemide 15 years", "Smoking 5 years"], correctAnswers: ["Phenytoin 20 years", "Furosemide 15 years", "Smoking 5 years"], explanation: "Long term phenytoin, furosemide, and smoking." },
    { q: "Which food is calcium-rich?", category: "osteoporosis", options: ["White bread", "Broccoli", "Apples", "Brown rice"], correctAnswer: "Broccoli", explanation: "Dark green leafy vegetables." },
    { q: "Which findings indicate osteoporosis risk? (Select all that apply)", category: "osteoporosis", type: "sata", options: ["3 alcoholic drinks/day", "Height loss 2 inches", "BMI 28", "Hyperthyroidism", "Age < 45"], correctAnswers: ["3 alcoholic drinks/day", "Height loss 2 inches", "Hyperthyroidism"], explanation: "Alcohol, height loss, hyperthyroidism." },
    { q: "Home safety for osteoporosis includes: (Select all that apply)", category: "osteoporosis", type: "sata", options: ["Remove rugs", "Use assistive devices", "Remove clutter", "Soft shoes", "Lighting"], correctAnswers: ["Remove rugs", "Use assistive devices", "Remove clutter", "Lighting"], explanation: "Prevent falls. No soft shoes." },
    { q: "Instruction for alendronate (Fosamax)?", category: "osteoporosis", options: ["With food", "With 8 oz water, upright 30 min", "At bedtime", "Crush if needed"], correctAnswer: "Take with 8 oz water and remain upright for 30 minutes", explanation: "Prevent esophageal irritation." },
    { q: "Recommended exercise for osteoporosis?", category: "osteoporosis", options: ["Swimming", "Weight-bearing exercises like walking", "Bed rest", "High impact"], correctAnswer: "Weight-bearing exercises like walking", explanation: "Weight bearing builds bone." },
    { q: "Administering raloxifene, report immediately:", category: "osteoporosis", options: ["Hot flashes", "Calf pain and tenderness", "Mild discomfort", "Insomnia"], correctAnswer: "Calf pain and tenderness", explanation: "DVT risk." },
    { q: "Bisphosphonate dental consideration?", category: "osteoporosis", options: ["No cleaning", "Checkup before starting", "Extract teeth", "None"], correctAnswer: "Dental examinations before starting therapy to prevent osteonecrosis of the jaw", explanation: "Risk of osteonecrosis of jaw." },
    { q: "Position after vertebroplasty?", category: "osteoporosis", options: ["Prone", "Supine for 1-2 hours", "High Fowler", "Lateral"], correctAnswer: "Supine for 1-2 hours", explanation: "Supine to compress puncture site." },
    { q: "Calcium supplement administration?", category: "osteoporosis", options: ["All at once", "Divided doses with food/water", "Empty stomach", "No Vitamin D"], correctAnswer: "Take with food in divided doses with water", explanation: "Divided doses absorb better." },
    { q: "Report finding with teriparatide (Forteo)?", category: "osteoporosis", options: ["Previous radiation therapy", "Cramping", "Calcium supplements", "Postmenopausal"], correctAnswer: "Previous radiation therapy to bones", explanation: "Risk of osteosarcoma." },
    { q: "Calcitonin nasal spray action?", category: "osteoporosis", options: ["Increases formation", "Decreases resorption by inhibiting osteoclasts", "Replaces estrogen", "For hypocalcemia only"], correctAnswer: "Decreases resorption by inhibiting osteoclasts", explanation: "Inhibits osteoclasts." },
    { q: "Findings of compartment syndrome? (Select all that apply)", category: "trauma", type: "sata", options: ["Pain 10/10 with passive movement", "Capillary refill 2s", "Hard swollen muscle", "Tingling", "Pulses present"], correctAnswers: ["Pain 10/10 with passive movement", "Hard swollen muscle", "Tingling"], explanation: "Pain, hardness, tingling." },
    { q: "Fracture with bone fragmenting into pieces?", category: "trauma", options: ["Oblique", "Comminuted", "Greenstick", "Spiral"], correctAnswer: "Comminuted fracture", explanation: "Comminuted means fragmented." },
    { q: "Cast pain unrelieved by meds? Priority?", category: "trauma", options: ["More meds", "Notify provider immediately", "Elevate", "Ice"], correctAnswer: "Notify the provider immediately", explanation: "Sign of compartment syndrome." },
    { q: "Understanding cast care?", category: "trauma", options: ["Coat hanger", "Keep dry", "Tight is good", "Powder"], correctAnswer: "Keep dry", explanation: "Keep casts dry." },
    { q: "Skeletal traction fact?", category: "trauma", options: ["Light weights", "Remove for repositioning", "Pins in bone, heavier weights", "For spasm only"], correctAnswer: "Pins are inserted into bone and can use 15-30 pound weights", explanation: "Pins in bone allow heavier weights." },
    { q: "Care for skeletal traction weights?", category: "trauma", options: ["Remove to reposition", "Hang freely at all times", "Add weight for pain", "Rest on bed"], correctAnswer: "Keep weights hanging freely at all times", explanation: "Weights must hang free." },
    { q: "Early sign of fat embolism?", category: "trauma", options: ["Petechiae", "Dyspnea with decreased O2 sat", "Resp failure", "Arrest"], correctAnswer: "Dyspnea with decreased oxygen saturation", explanation: "Hypoxia/dyspnea is early. Petechiae is late." },
    { q: "Fat embolism manifestation in femur fracture?", category: "trauma", options: ["Pain", "Petechial rash on chest with resp distress", "Swelling", "Cool extremity"], correctAnswer: "Petechial rash on the chest with respiratory distress", explanation: "Petechial rash on chest is classic." },
    { q: "Pin care for external fixation?", category: "trauma", options: ["Same swab all pins", "One swab per pin with solution", "Remove crusting", "Ointment"], correctAnswer: "Using one cotton swab per pin with prescribed solution", explanation: "Prevent cross contamination." },
    { q: "External fixation discharge understanding?", category: "trauma", options: ["White drainage ok", "Sterile water only", "Tighten pins", "Report increased drainage or loosening"], correctAnswer: "Report increased drainage or loosening", explanation: "Report signs of infection or failure." },
    { q: "Osteomyelitis complication?", category: "trauma", options: ["Hypoglycemia", "Need for long-term antibiotics (4-6 weeks)", "Immediate resolution", "Weight gain"], correctAnswer: "Need for long-term antibiotic therapy (4-6 weeks)", explanation: "Antibiotics for 4-6 weeks." },
    { q: "The 5 P's? (Select all that apply)", category: "trauma", type: "sata", options: ["Pain", "Pressure", "Paresthesia", "Pallor", "Pulselessness", "Paralysis"], correctAnswers: ["Pain", "Paresthesia", "Pallor", "Pulselessness", "Paralysis"], explanation: "Pain, Pallor, Paresthesia, Pulselessness, Paralysis." },
    { q: "Buck's traction purpose?", category: "trauma", options: ["Permanent stabilization", "Decrease muscle spasms/immobilize", "Replace surgery", "Weight bearing"], correctAnswer: "Decrease muscle spasms and immobilize before surgery", explanation: "Temporary immobilization." },
    { q: "Handling wet plaster cast?", category: "trauma", options: ["Fingertips", "Palms", "Hard surface", "Plastic cover"], correctAnswer: "Use the palms of the hands to prevent denting", explanation: "Use palms." },
    { q: "Cast application finding requiring intervention?", category: "trauma", options: ["Itching", "Warmth", "Numbness and tingling", "Swelling"], correctAnswer: "Client reports numbness and tingling in fingers", explanation: "Sign of nerve compression." }
];
class MSKReviewRunner {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();

        this.state = 'menu';
        this.shopScroll = 0; // For outfit shop navigation
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.streak = 0;
        this.multiplier = 1;
        this.distance = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.level = 1;
        this.highScore = parseInt(localStorage.getItem('anatomyRush2025HS')) || 0;
        this.totalCoins = parseInt(localStorage.getItem('anatomyRush2025Coins')) || 0;

        this.lanes = 3;
        this.currentLane = 1;
        this.targetLane = 1;
        this.laneWidth = 150;

        this.player = {
            jumpHeight: 0,
            jumpVelocity: 0,
            isJumping: false,
            canDoubleJump: true,
            isSliding: false,
            slideTimer: 0,
            animFrame: 0,
            invincible: 0,
            shield: 0,
            magnet: 0,
            speedBoost: 0,
            trail: [],
            dashCooldown: 0,
            isDashing: false,
            dashTimer: 0
        };

        // Weather system
        this.weather = 'clear';
        this.weatherTimer = 0;
        this.raindrops = [];
        this.snowflakes = [];

        // Achievements
        this.achievements = JSON.parse(localStorage.getItem('anatomyAchievements')) || {};
        this.newAchievement = null;

        this.speed = 1.2;
        this.maxSpeed = 3.5;

        this.obstacles = [];
        this.coins_arr = [];
        this.powerups = [];
        this.particles = [];
        this.floatingTexts = [];
        this.buildings = [];
        this.stars = [];

        // Special events
        this.feverMode = false;
        this.feverTimer = 0;
        this.coinRush = false;
        this.coinRushTimer = 0;
        this.perfectRun = true;
        this.totalJumps = 0;
        this.totalDashes = 0;
        this.coinsThisRun = 0;
        this.questionsCorrect = 0;

        // Generate stars for parallax (reduced for performance)
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random() * 2000,
                y: Math.random() * 400,
                size: 0.5 + Math.random() * 2,
                speed: 0.1 + Math.random() * 0.3,
                twinkle: Math.random() * 6.28
            });
        }

        this.questionDistance = 12000;
        this.nextQuestionAt = this.questionDistance;
        this.questionIncrement = 5000;
        this.currentQuestion = null;
        this.questionTimer = 0;
        this.questionTimeLimit = 15;
        this.selectedAnswer = -1;
        this.questionResult = null;

        // Question review system
        this.questionHistory = [];
        this.questionsAnswered = 0;
        this.questionsCorrectRun = 0;
        this.askedQuestionIndices = []; // Track which questions have been asked this run
        this.questionBag = []; // Bag for randomization

        // Time of day (changes based on distance)
        this.timeOfDay = 'dawn'; // dawn, day, dusk, night

        // Confetti system
        this.confetti = [];

        // Lifetime stats
        this.stats = JSON.parse(localStorage.getItem('anatomyRushStats')) || {
            totalRuns: 0,
            totalDistance: 0,
            totalCoins: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            bestStreak: 0,
            highestLevel: 0
        };

        this.lastObstacle = 0;
        this.obstacleGap = 500;
        this.shake = 0;
        this.flash = null;
        this.running = false;
        this.lastTime = 0;
        this.globalTime = 0;
        // Generate buildings (reduced for performance)
        for (let i = 0; i < 15; i++) {
            this.buildings.push({
                x: i * 90 - 200,
                height: 60 + Math.random() * 280,
                width: 40 + Math.random() * 50,
                windows: Math.floor(Math.random() * 5) + 2,
                hue: Math.random() * 80 + 180,
                lit: Math.random() > 0.25
            });
        }

        // OUTFIT SHOP SYSTEM
        this.outfits = {
            teal: { name: 'Classic Teal', color: '#06b6d4', price: 0, owned: true },
            pink: { name: 'Hot Pink', color: '#ec4899', price: 50, owned: false },
            purple: { name: 'Royal Purple', color: '#8b5cf6', price: 100, owned: false },
            green: { name: 'Mint Fresh', color: '#22c55e', price: 150, owned: false },
            gold: { name: 'Golden Star', color: '#fbbf24', price: 250, owned: false },
            rainbow: { name: 'Rainbow Pride', color: 'rainbow', price: 500, owned: false }
        };
        this.currentOutfit = localStorage.getItem('anatomyOutfit') || 'teal';
        const savedOutfits = JSON.parse(localStorage.getItem('anatomyOwnedOutfits') || '{}');
        Object.keys(savedOutfits).forEach(k => { if (this.outfits[k]) this.outfits[k].owned = savedOutfits[k]; });

        // SOUND EFFECTS (Web Audio API)
        this.audioCtx = null;
        this.soundEnabled = localStorage.getItem('anatomySoundEnabled') !== 'false';

        // ENHANCED WEATHER
        this.lightning = { active: false, timer: 0, flash: 0 };
        this.puddles = [];

        this.bindEvents();
    }

    resize() {
        const container = this.canvas.parentElement;
        const maxW = Math.min(container.offsetWidth - 20, 1600);
        const maxH = Math.min(window.innerHeight - 100, 850);
        this.canvas.width = maxW / 16 * 9 > maxH ? maxH / 9 * 16 : maxW;
        this.canvas.height = maxW / 16 * 9 > maxH ? maxH : maxW / 16 * 9;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerX = this.width / 2;
    }

    bindEvents() {
        const handleKey = (e) => {
            const keys = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Enter', 'KeyO', 'KeyB', 'Escape'];
            if (keys.includes(e.code) && this.running) { e.preventDefault(); e.stopPropagation(); }

            // Menu state - O opens shop, Space starts game
            if (this.state === 'menu') {
                if (e.code === 'KeyO') { this.state = 'shop'; this.shopScroll = 0; return; }
                if (e.code === 'Space' || e.code === 'Enter') { this.startGame(); return; }
            }

            // Shop state - navigation and selection
            if (this.state === 'shop') {
                const outfitKeys = Object.keys(this.outfits);
                if (e.code === 'Escape' || e.code === 'KeyO') { this.state = 'menu'; return; }
                if (e.code === 'ArrowUp' || e.code === 'KeyW') { this.shopScroll = Math.max(0, this.shopScroll - 1); return; }
                if (e.code === 'ArrowDown' || e.code === 'KeyS') { this.shopScroll = Math.min(outfitKeys.length - 1, this.shopScroll + 1); return; }
                if (e.code === 'Enter') {
                    const selectedKey = outfitKeys[this.shopScroll];
                    if (this.outfits[selectedKey].owned) {
                        this.equipOutfit(selectedKey);
                        this.playSound('coin');
                    }
                    return;
                }
                if (e.code === 'KeyB') {
                    const selectedKey = outfitKeys[this.shopScroll];
                    if (this.buyOutfit(selectedKey)) {
                        this.addFloatingText(this.centerX, this.height / 2, '🎉 Outfit Purchased!', '#22c55e');
                    }
                    return;
                }
                return;
            }

            if (this.state === 'gameover' && (e.code === 'Space' || e.code === 'Enter')) { this.state = 'menu'; return; }
            if (this.state === 'question') {
                const n = parseInt(e.code.replace('Digit', ''));
                if (n >= 1 && n <= 4) this.selectAnswer(n - 1);
                return;
            }
            if (this.state === 'playing') {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.switchLane(-1);
                if (e.code === 'ArrowRight' || e.code === 'KeyD') this.switchLane(1);
                if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') this.jump();
                if (e.code === 'ArrowDown' || e.code === 'KeyS') this.slide();
                if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyX') this.dash();
            }
        };
        if (this._kh) document.removeEventListener('keydown', this._kh);
        this._kh = handleKey;
        document.addEventListener('keydown', this._kh);

        this.canvas.addEventListener('click', (e) => {
            if (this.state === 'menu') { this.startGame(); return; }
            if (this.state === 'gameover') { this.state = 'menu'; return; }
            if (this.state === 'question') this.handleQuestionClick(e);
        });

        let tx = 0, ty = 0;
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); tx = e.touches[0].clientX; ty = e.touches[0].clientY; if (this.state === 'menu') this.startGame(); if (this.state === 'gameover') this.state = 'menu'; }, { passive: false });
        this.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (this.state !== 'playing') return; const dx = e.touches[0].clientX - tx, dy = e.touches[0].clientY - ty; if (Math.abs(dx) > 40) { this.switchLane(dx > 0 ? 1 : -1); tx = e.touches[0].clientX; } if (dy < -50) { this.jump(); ty = e.touches[0].clientY; } if (dy > 50) { this.slide(); ty = e.touches[0].clientY; } }, { passive: false });
        window.addEventListener('resize', () => this.resize());
    }

    switchLane(dir) {
        const nl = this.targetLane + dir;
        if (nl >= 0 && nl < 3) { this.targetLane = nl; }
    }

    jump() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isJumping = true;
            this.player.jumpVelocity = 24;
            this.player.canDoubleJump = true;
            this.playSound('jump');
        } else if (this.player.isJumping && this.player.canDoubleJump) {
            this.player.jumpVelocity = 20;
            this.player.canDoubleJump = false;
            this.addFloatingText(this.getLaneX(this.currentLane), this.height - 150, 'DOUBLE JUMP!', '#22c55e');
            this.playSound('jump');
        }
    }

    slide() {
        if (!this.player.isJumping && !this.player.isSliding) {
            this.player.isSliding = true;
            this.player.slideTimer = 50;
        }
    }

    dash() {
        if (this.player.dashCooldown <= 0 && !this.player.isDashing) {
            this.player.isDashing = true;
            this.player.dashTimer = 15;
            this.player.dashCooldown = 120;
            this.player.invincible = Math.max(this.player.invincible, 20);
            this.addFloatingText(this.getLaneX(this.currentLane), this.height - 200, 'DASH!', '#f472b6');
            for (let i = 0; i < 15; i++) this.addParticles(this.getLaneX(this.currentLane), this.height - 80, 1, '#f472b6');
            this.addParticles(this.getLaneX(this.currentLane), this.height - 40, 10, '#f59e0b');
        }
    }

    addParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            this.particles.push({ x, y, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12 - 5, size: 3 + Math.random() * 6, life: 40, color });
        }
    }

    addFloatingText(x, y, text, color) {
        this.floatingTexts.push({ x, y, text, color, life: 60, vy: -2 });
    }

    spawnConfetti(count) {
        const colors = ['#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#6366f1', '#d946ef', '#f472b6'];
        for (let i = 0; i < count; i++) {
            this.confetti.push({
                x: this.centerX + (Math.random() - 0.5) * 400,
                y: this.height * 0.3,
                vx: (Math.random() - 0.5) * 8,
                vy: -8 - Math.random() * 6,
                size: 6 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                spin: (Math.random() - 0.5) * 15,
                life: 120 + Math.random() * 60
            });
        }
    }

    // SOUND EFFECTS SYSTEM
    playSound(type) {
        if (!this.soundEnabled) return;
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const ctx = this.audioCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        switch (type) {
            case 'jump':
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                osc.start(); osc.stop(ctx.currentTime + 0.15);
                break;
            case 'coin':
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start(); osc.stop(ctx.currentTime + 0.1);
                break;
            case 'hit':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                osc.start(); osc.stop(ctx.currentTime + 0.25);
                break;
            case 'powerup':
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
                osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(); osc.stop(ctx.currentTime + 0.3);
                break;
            case 'levelup':
                osc.frequency.setValueAtTime(523, ctx.currentTime);
                osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.start(); osc.stop(ctx.currentTime + 0.4);
                break;
        }
    }

    // OUTFIT SHOP FUNCTIONS
    buyOutfit(outfitId) {
        const outfit = this.outfits[outfitId];
        if (!outfit || outfit.owned) return false;
        if (this.totalCoins >= outfit.price) {
            this.totalCoins -= outfit.price;
            outfit.owned = true;
            localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
            const ownedData = {};
            Object.keys(this.outfits).forEach(k => { ownedData[k] = this.outfits[k].owned; });
            localStorage.setItem('anatomyOwnedOutfits', JSON.stringify(ownedData));
            this.playSound('powerup');
            return true;
        }
        return false;
    }

    equipOutfit(outfitId) {
        if (this.outfits[outfitId] && this.outfits[outfitId].owned) {
            this.currentOutfit = outfitId;
            localStorage.setItem('anatomyOutfit', outfitId);
            return true;
        }
        return false;
    }

    getOutfitColor() {
        const outfit = this.outfits[this.currentOutfit];
        if (outfit.color === 'rainbow') {
            const hue = (this.globalTime * 0.1) % 360;
            return `hsl(${hue}, 80%, 55%)`;
        }
        return outfit.color;
    }

    getDarkerColor(color) {
        // Create a darker version for pants
        if (color.startsWith('hsl')) {
            return color.replace('55%', '40%');
        }
        // Convert hex to darker shade
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgb(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.7)})`;
    }

    getLaneX(lane) { return this.centerX + (lane - 1) * this.laneWidth; }

    startGame() {
        this.state = 'playing';
        this.score = 0; this.coins = 0; this.lives = 3; this.streak = 0; this.multiplier = 1;
        this.distance = 0; this.speed = 1.2; this.currentLane = 1; this.targetLane = 1;
        this.combo = 0; this.comboTimer = 0; this.level = 1;
        this.obstacles = []; this.coins_arr = []; this.powerups = []; this.particles = []; this.floatingTexts = [];
        this.player.isJumping = false; this.player.isSliding = false; this.player.jumpHeight = 0;
        this.player.invincible = 0; this.player.shield = 0; this.player.magnet = 0; this.player.speedBoost = 0;
        this.player.trail = []; this.player.canDoubleJump = true;
        this.lastObstacle = 0; this.nextQuestionAt = this.questionDistance;

        // Reset new features
        this.questionHistory = [];
        this.shuffleQuestionBag();
        this.questionsAnswered = 0;
        this.questionsCorrectRun = 0;
        this.askedQuestionIndices = []; // Reset for new run
        this.timeOfDay = 'dawn';
        this.confetti = [];
        this.feverMode = false;
        this.feverTimer = 0;
        this.coinRush = false;
        this.coinRushTimer = 0;
        this.perfectRun = true;
    }

    shuffleQuestionBag() {
        // Create an array of indices [0, 1, ... N-1]
        this.questionBag = Array.from({ length: gameQuizQuestions.length }, (_, i) => i);
        // Fisher-Yates shuffle
        for (let i = this.questionBag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questionBag[i], this.questionBag[j]] = [this.questionBag[j], this.questionBag[i]];
        }
    }

    update(dt) {
        this.globalTime += dt;
        if (this.shake > 0) this.shake *= 0.85;
        if (this.flash) { this.flash.timer--; if (this.flash.timer <= 0) this.flash = null; }
        if (this.player.invincible > 0) this.player.invincible--;
        if (this.player.shield > 0) this.player.shield--;
        if (this.player.magnet > 0) this.player.magnet--;
        if (this.player.speedBoost > 0) this.player.speedBoost--;
        if (this.comboTimer > 0) { this.comboTimer--; if (this.comboTimer <= 0) this.combo = 0; }
        if (this.player.dashCooldown > 0) this.player.dashCooldown--;
        if (this.player.dashTimer > 0) { this.player.dashTimer--; if (this.player.dashTimer <= 0) this.player.isDashing = false; }
        if (this.newAchievement) { this.newAchievement.timer--; if (this.newAchievement.timer <= 0) this.newAchievement = null; }

        // Weather system
        this.weatherTimer--;
        if (this.weatherTimer <= 0) {
            const weathers = ['clear', 'clear', 'clear', 'rain', 'snow'];
            this.weather = weathers[Math.floor(Math.random() * weathers.length)];
            this.weatherTimer = 1800 + Math.random() * 1800;
            // Reset puddles when weather changes
            if (this.weather !== 'rain') {
                this.puddles = [];
            }
        }
        if (this.weather === 'rain') {
            if (this.raindrops.length < 50) this.raindrops.push({ x: Math.random() * this.width, y: -10, speed: 8 + Math.random() * 6 });
            this.raindrops = this.raindrops.filter(r => { r.y += r.speed; r.x -= 2; return r.y < this.height; });

            // Lightning system
            if (this.lightning.timer > 0) {
                this.lightning.timer--;
                if (this.lightning.timer <= 0) this.lightning.active = false;
            }
            if (this.lightning.flash > 0) this.lightning.flash--;
            // Random lightning strike
            if (Math.random() < 0.0008 && !this.lightning.active) {
                this.lightning.active = true;
                this.lightning.timer = 8 + Math.floor(Math.random() * 12);
                this.lightning.flash = 12;
            }

            // Spawn puddles during rain
            if (this.puddles.length < 8 && Math.random() < 0.005) {
                this.puddles.push({
                    x: this.centerX + (Math.random() - 0.5) * 400,
                    z: 1500 + Math.random() * 700,
                    width: 40 + Math.random() * 60,
                    shimmer: Math.random() * 6.28
                });
            }
            // Update puddles
            const speedMod = this.player.speedBoost > 0 ? 1.5 : 1;
            this.puddles = this.puddles.filter(p => {
                p.z -= this.speed * speedMod * 22;
                p.shimmer += 0.08;
                return p.z > -100;
            });
        } else {
            this.raindrops = [];
            this.lightning.active = false;
            this.lightning.flash = 0;
        }
        if (this.weather === 'snow') {
            if (this.snowflakes.length < 80) this.snowflakes.push({ x: Math.random() * this.width, y: -10, speed: 1 + Math.random() * 2, wobble: Math.random() * 6.28 });
            this.snowflakes = this.snowflakes.filter(s => { s.y += s.speed; s.x += Math.sin(s.wobble += 0.05) * 0.5; return s.y < this.height; });
        } else { this.snowflakes = []; }

        this.particles = this.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life--; p.size *= 0.94; return p.life > 0; });
        this.floatingTexts = this.floatingTexts.filter(t => { t.y += t.vy; t.life--; return t.life > 0; });

        // Update stars
        this.stars.forEach(s => { s.x -= s.speed * this.speed; s.twinkle += 0.05; if (s.x < 0) s.x = this.width + 100; });

        // Fever mode & coin rush
        if (this.feverTimer > 0) { this.feverTimer--; if (this.feverTimer <= 0) { this.feverMode = false; this.addFloatingText(this.centerX, 200, 'FEVER ENDED', '#f472b6'); } }
        if (this.coinRushTimer > 0) { this.coinRushTimer--; if (this.coinRushTimer <= 0) { this.coinRush = false; } }

        const bSpeed = this.speed * (this.player.speedBoost > 0 ? 1.5 : 1);
        this.buildings.forEach(b => { b.x -= bSpeed * 0.35; if (b.x < -b.width - 50) { b.x = this.width + Math.random() * 100; b.height = 60 + Math.random() * 280; b.lit = Math.random() > 0.25; } });

        if (this.state !== 'playing') return;

        const speedMod = this.player.speedBoost > 0 ? 1.5 : 1;
        const feverMod = this.feverMode ? 1.3 : 1;
        if (this.speed < this.maxSpeed) this.speed += 0.0002;
        this.distance += this.speed * speedMod * 12;
        this.score = Math.floor(this.distance / 10) * this.multiplier * (this.feverMode ? 2 : 1);

        // Trigger fever mode on high combo
        if (this.combo >= 15 && !this.feverMode) {
            this.feverMode = true;
            this.feverTimer = 600; // 10 seconds
            this.addFloatingText(this.centerX, this.height / 2 - 50, '🔥 FEVER MODE! 🔥', '#f472b6');
            this.flash = { color: '#f472b6', timer: 25 };
            this.unlockAchievement('fever', 'On Fire! - Activate Fever Mode');
        }

        // Random coin rush event
        if (Math.random() < 0.0003 && !this.coinRush && this.distance > 5000) {
            this.coinRush = true;
            this.coinRushTimer = 300;
            this.addFloatingText(this.centerX, 150, '💰 COIN RUSH! 💰', '#fbbf24');
        }

        // Time of day progression (changes based on distance)
        if (this.distance < 15000) this.timeOfDay = 'dawn';
        else if (this.distance < 40000) this.timeOfDay = 'day';
        else if (this.distance < 70000) this.timeOfDay = 'dusk';
        else this.timeOfDay = 'night';

        // Update confetti
        this.confetti = this.confetti.filter(c => {
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.15;
            c.rotation += c.spin;
            c.life--;
            return c.life > 0 && c.y < this.height + 50;
        });

        // Level progression
        const newLevel = Math.floor(this.distance / 10000) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.addFloatingText(this.centerX, this.height / 2, `🎉 LEVEL ${this.level}! 🎉`, '#fbbf24');
            this.flash = { color: '#fbbf24', timer: 20 };
            this.spawnConfetti(60); // Celebration!
            this.playSound('levelup');
            if (this.level > this.stats.highestLevel) this.stats.highestLevel = this.level;
            if (this.level === 2) this.unlockAchievement('level2', 'Warming Up - Reach Level 2');
            if (this.level === 3) this.unlockAchievement('level3', 'Getting Serious - Reach Level 3');
            if (this.level === 5) this.unlockAchievement('level5', 'Expert Runner - Reach Level 5');
            if (this.level === 10) this.unlockAchievement('level10', 'Legendary - Reach Level 10');
        }

        this.currentLane += (this.targetLane - this.currentLane) * 0.2;

        // Player trail
        if (this.state === 'playing') {
            this.player.trail.push({ x: this.getLaneX(this.currentLane), y: this.height - 45 - this.player.jumpHeight, alpha: 1 });
            if (this.player.trail.length > 12) this.player.trail.shift();
            this.player.trail.forEach(t => t.alpha *= 0.85);
        }

        if (this.player.isJumping) {
            this.player.jumpHeight += this.player.jumpVelocity;
            this.player.jumpVelocity -= 1.1;
            if (this.player.jumpHeight <= 0) { this.player.jumpHeight = 0; this.player.isJumping = false; this.player.canDoubleJump = true; }
        }
        if (this.player.isSliding) { this.player.slideTimer--; if (this.player.slideTimer <= 0) this.player.isSliding = false; }
        this.player.animFrame = (this.player.animFrame + 0.4) % 8;

        if (this.distance - this.lastObstacle > this.obstacleGap / this.speed) { this.spawnObstacle(); this.lastObstacle = this.distance; }
        const coinRate = this.coinRush ? 0.08 : (this.feverMode ? 0.04 : 0.018);
        if (Math.random() < coinRate) this.spawnCoin();
        if (Math.random() < 0.004) this.spawnPowerup();

        this.updateObstacles();
        this.updateCoins();
        this.updatePowerups();

        if (this.distance >= this.nextQuestionAt) {
            this.triggerQuestion();
            this.nextQuestionAt += this.questionIncrement + Math.floor(this.distance / 2500) * 600;
        }
    }

    spawnObstacle() {
        const lane = Math.floor(Math.random() * 3);
        const types = ['low', 'high', 'low', 'low', 'high'];
        if (this.level >= 3 && Math.random() > 0.7) types.push('moving');
        const type = types[Math.floor(Math.random() * types.length)];
        this.obstacles.push({ lane, z: 2200, type, hit: false, moveDir: Math.random() > 0.5 ? 1 : -1 });
    }

    spawnCoin() {
        const lane = Math.floor(Math.random() * 3);
        this.coins_arr.push({ lane, z: 2200, elevated: Math.random() > 0.45, collected: false, bob: Math.random() * 6.28 });
    }

    spawnPowerup() {
        const lane = Math.floor(Math.random() * 3);
        const types = ['shield', 'magnet', 'speed', 'heart'];
        if (this.level >= 2) types.push('coin_burst');
        this.powerups.push({ lane, z: 2200, type: types[Math.floor(Math.random() * types.length)], collected: false, bob: Math.random() * 6.28 });
    }

    updateObstacles() {
        const speedMod = this.player.speedBoost > 0 ? 1.5 : 1;
        this.obstacles = this.obstacles.filter(obs => {
            obs.z -= this.speed * speedMod * 22;
            if (obs.type === 'moving' && obs.z < 1500) {
                obs.lane += obs.moveDir * 0.02;
                if (obs.lane <= 0 || obs.lane >= 2) obs.moveDir *= -1;
            }
            if (obs.z < 130 && obs.z > -60 && !obs.hit) {
                if (Math.abs(obs.lane - this.currentLane) < 0.6) {
                    let hit = false;
                    if (obs.type === 'high' && !this.player.isSliding) hit = true;
                    else if ((obs.type === 'low' || obs.type === 'moving') && this.player.jumpHeight < 80) hit = true;
                    if (hit && this.player.invincible <= 0 && this.player.shield <= 0) { this.hitObstacle(); obs.hit = true; }
                    else if (hit && this.player.shield > 0) { this.player.shield = 0; this.flash = { color: '#06b6d4', timer: 12 }; this.addParticles(this.getLaneX(Math.round(obs.lane)), this.height - 150, 25, '#06b6d4'); obs.hit = true; }
                }
            }
            return obs.z > -500;
        });
    }

    updateCoins() {
        const speedMod = this.player.speedBoost > 0 ? 1.5 : 1;
        const magnetRange = this.player.magnet > 0 ? 2.5 : 0;
        this.coins_arr = this.coins_arr.filter(c => {
            c.z -= this.speed * speedMod * 22; c.bob += 0.14;
            if (magnetRange > 0 && c.z < 600) c.lane += (this.currentLane - c.lane) * 0.12;
            if (c.z < 130 && c.z > -60 && !c.collected && Math.abs(c.lane - this.currentLane) < 0.7) {
                if (!c.elevated || this.player.jumpHeight > 60) {
                    c.collected = true; this.coins++; this.totalCoins++;
                    this.combo++; this.comboTimer = 120;
                    const bonus = this.combo >= 10 ? 3 : this.combo >= 5 ? 2 : 1;
                    this.coins += bonus - 1;
                    if (this.combo === 5) this.addFloatingText(this.getLaneX(Math.round(c.lane)), this.height - 200, 'COMBO x2!', '#fbbf24');
                    if (this.combo === 10) this.addFloatingText(this.getLaneX(Math.round(c.lane)), this.height - 200, 'COMBO x3!', '#ef4444');
                    localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
                    this.addParticles(this.getLaneX(Math.round(c.lane)), this.height - 180, 15, '#fbbf24');
                    this.playSound('coin');
                }
            }
            return c.z > -500 && !c.collected;
        });
    }

    updatePowerups() {
        const speedMod = this.player.speedBoost > 0 ? 1.5 : 1;
        this.powerups = this.powerups.filter(p => {
            p.z -= this.speed * speedMod * 22; p.bob += 0.12;
            if (p.z < 130 && p.z > -60 && !p.collected && Math.abs(p.lane - this.currentLane) < 0.7) {
                p.collected = true; this.collectPowerup(p.type, p.lane);
                this.addParticles(this.getLaneX(p.lane), this.height - 200, 25, this.getPowerupColor(p.type));
            }
            return p.z > -500 && !p.collected;
        });
    }

    collectPowerup(type, lane) {
        this.flash = { color: this.getPowerupColor(type), timer: 15 };
        const icons = { shield: '🛡️', magnet: '🧲', speed: '⚡', heart: '❤️', coin_burst: '💰' };
        this.addFloatingText(this.getLaneX(lane), this.height - 250, icons[type], this.getPowerupColor(type));

        switch (type) {
            case 'shield': this.player.shield = 700; break;
            case 'magnet': this.player.magnet = 700; break;
            case 'speed': this.player.speedBoost = 400; break;
            case 'heart': if (this.lives < 5) this.lives++; break;
            case 'coin_burst':
                for (let i = 0; i < 8; i++) { this.coins_arr.push({ lane: Math.random() * 2, z: 800 + i * 80, elevated: false, collected: false, bob: Math.random() * 6.28 }); }
                break;
        }
    }

    getPowerupColor(type) {
        return { shield: '#06b6d4', magnet: '#a855f7', speed: '#22c55e', heart: '#ef4444', coin_burst: '#fbbf24' }[type] || '#fff';
    }

    hitObstacle() {
        this.lives--; this.streak = 0; this.multiplier = 1; this.combo = 0; this.shake = 25;
        this.flash = { color: '#ef4444', timer: 20 }; this.player.invincible = 120;
        this.addParticles(this.getLaneX(Math.round(this.currentLane)), this.height - 120, 15, '#ef4444');
        this.playSound('hit');
        if (this.lives <= 0) this.gameOver();
    }

    gameOver() {
        this.state = 'gameover';
        if (this.score > this.highScore) { this.highScore = this.score; localStorage.setItem('anatomyRush2025HS', this.highScore); }
        if (typeof awardXP === 'function') awardXP(Math.floor(this.score / 10), 'game');
    }

    triggerQuestion() {
        this.state = 'question'; this.questionTimer = this.questionTimeLimit * 60;
        this.selectedAnswer = -1; this.selectedAnswers = []; this.questionResult = null;

        // Use Bag System for Non-Repeating Random Questions
        if (this.questionBag.length === 0) {
            this.shuffleQuestionBag();
        }
        const randomIdx = this.questionBag.pop();
        this.askedQuestionIndices.push(randomIdx);

        const q = gameQuizQuestions[randomIdx];
        const shuffledOpts = [...q.options];

        // Shuffle options
        for (let i = shuffledOpts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOpts[i], shuffledOpts[j]] = [shuffledOpts[j], shuffledOpts[i]];
        }

        // Store question with all metadata
        this.currentQuestion = {
            text: q.q,
            options: shuffledOpts,
            type: q.type || 'single', // 'sata' or 'single'
            correct: q.correctAnswer || null, // For single-answer
            correctAnswers: q.correctAnswers || [], // For SATA
            explanation: q.explanation || ''
        };
    }

    shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

    selectAnswer(idx) {
        if (this.questionResult !== null || idx >= this.currentQuestion.options.length) return;

        // SATA: Toggle selection (multi-select)
        if (this.currentQuestion.type === 'sata') {
            const arrIdx = this.selectedAnswers.indexOf(idx);
            if (arrIdx === -1) {
                this.selectedAnswers.push(idx);
            } else {
                this.selectedAnswers.splice(arrIdx, 1);
            }
            return; // Don't submit yet - wait for Submit button
        }

        // Single-answer: Immediate submission
        this.selectedAnswer = idx;
        const correct = this.currentQuestion.options[idx] === this.currentQuestion.correct;
        this.questionsAnswered++;

        // Track question for review
        this.questionHistory.push({
            question: this.currentQuestion.text,
            userAnswer: this.currentQuestion.options[idx],
            correctAnswer: this.currentQuestion.correct,
            correct: correct
        });

        if (correct) {
            this.questionResult = 'correct'; this.streak++; this.questionsCorrectRun++;
            this.multiplier = Math.min(5, 1 + Math.floor(this.streak / 2));
            const reward = 25 * this.multiplier;
            this.coins += reward; this.totalCoins += reward;
            localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
            this.flash = { color: '#22c55e', timer: 20 };

            // Achievements
            if (this.questionsCorrectRun === 3) this.unlockAchievement('scholar', 'Scholar - 3 correct in a row');
            if (this.questionsCorrectRun === 5) this.unlockAchievement('genius', 'Genius - 5 correct in a row');
        } else {
            this.questionResult = 'wrong'; this.lives--; this.streak = 0; this.multiplier = 1;
            this.shake = 18; this.flash = { color: '#ef4444', timer: 18 };
            this.perfectRun = false;
            if (this.lives <= 0) { setTimeout(() => this.gameOver(), 2500); return; }
        }
        // Extended timeout to show rationale
        setTimeout(() => {
            this.state = 'playing';
            this.currentQuestion = null;
            this.player.invincible = 120; // 2s grace period
        }, 2500);
    }

    submitSATAAnswer() {
        if (this.questionResult !== null || this.currentQuestion.type !== 'sata') return;
        if (this.selectedAnswers.length === 0) return; // Must select at least one

        // Get selected answer texts
        const selectedTexts = this.selectedAnswers.map(i => this.currentQuestion.options[i]);
        const correctTexts = this.currentQuestion.correctAnswers;

        // Check if arrays match (order-independent)
        const correct = selectedTexts.length === correctTexts.length &&
            selectedTexts.every(t => correctTexts.includes(t));

        this.questionsAnswered++;

        // Track question for review
        this.questionHistory.push({
            question: this.currentQuestion.text,
            userAnswer: selectedTexts.join(', '),
            correctAnswer: correctTexts.join(', '),
            correct: correct
        });

        if (correct) {
            this.questionResult = 'correct'; this.streak++; this.questionsCorrectRun++;
            this.multiplier = Math.min(5, 1 + Math.floor(this.streak / 2));
            const reward = 35 * this.multiplier; // Bonus for SATA
            this.coins += reward; this.totalCoins += reward;
            localStorage.setItem('anatomyRush2025Coins', this.totalCoins);
            this.flash = { color: '#22c55e', timer: 20 };
        } else {
            this.questionResult = 'wrong'; this.lives--; this.streak = 0; this.multiplier = 1;
            this.shake = 18; this.flash = { color: '#ef4444', timer: 18 };
            this.perfectRun = false;
            if (this.lives <= 0) { setTimeout(() => this.gameOver(), 2500); return; }
        }
        // Extended timeout to show rationale
        setTimeout(() => {
            this.state = 'playing';
            this.currentQuestion = null;
            this.selectedAnswers = [];
            this.player.invincible = 120;
        }, 3000);
    }

    handleQuestionClick(e) {
        if (!this.currentQuestion || this.questionResult !== null) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.width / rect.width);
        const y = (e.clientY - rect.top) * (this.height / rect.height);
        const startY = this.height * 0.26, optH = 52, gap = 12, margin = this.width * 0.06;

        // Check SATA submit button
        if (this.currentQuestion.type === 'sata' && this.sataSubmitBtn) {
            const btn = this.sataSubmitBtn;
            if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                this.submitSATAAnswer();
                return;
            }
        }

        // Check option clicks
        for (let i = 0; i < this.currentQuestion.options.length; i++) {
            const oY = startY + i * (optH + gap);
            if (x >= margin && x <= this.width - margin && y >= oY && y <= oY + optH) {
                this.selectAnswer(i);
                break;
            }
        }
    }

    render() {
        this.ctx.save();
        if (this.shake > 0) this.ctx.translate((Math.random() - 0.5) * this.shake * 2, (Math.random() - 0.5) * this.shake * 2);
        this.drawBackground();
        this.drawRoad();
        this.drawObstacles();
        this.drawCoins();
        this.drawPowerups();
        this.drawPlayer();
        this.drawFloatingTexts();
        if (this.state === 'playing') this.drawHUD();
        else if (this.state === 'menu') this.drawMenu();
        else if (this.state === 'shop') this.drawShop();
        else if (this.state === 'question') this.drawQuestion();
        else if (this.state === 'gameover') this.drawGameOver();
        if (this.flash) { this.ctx.fillStyle = this.flash.color; this.ctx.globalAlpha = this.flash.timer / 30; this.ctx.fillRect(0, 0, this.width, this.height); this.ctx.globalAlpha = 1; }
        this.ctx.restore();
    }

    drawConfetti() {
        this.confetti.forEach(c => {
            this.ctx.save();
            this.ctx.translate(c.x, c.y);
            this.ctx.rotate(c.rotation * Math.PI / 180);
            this.ctx.globalAlpha = Math.min(1, c.life / 30);
            this.ctx.fillStyle = c.color;
            this.ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
            this.ctx.restore();
        });
        this.ctx.globalAlpha = 1;
    }

    drawWeather() {
        if (this.weather === 'rain') {
            // Lightning flash effect
            if (this.lightning.flash > 0) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${this.lightning.flash / 15})`;
                this.ctx.fillRect(0, 0, this.width, this.height);
            }

            // Raindrops
            this.ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
            this.ctx.lineWidth = 1.5;
            this.raindrops.forEach(r => {
                this.ctx.beginPath();
                this.ctx.moveTo(r.x, r.y);
                this.ctx.lineTo(r.x - 4, r.y + 12);
                this.ctx.stroke();
            });

            // Draw puddles on road
            const horizonY = this.height * 0.4;
            this.puddles.forEach(p => {
                const z = p.z / 2200;
                const perspective = 1 / (1 + z * 5);
                const y = horizonY + (this.height - horizonY) * (1 - Math.pow(z, 0.55));
                const w = p.width * perspective;
                const h = 8 * perspective;
                const x = this.centerX + (p.x - this.centerX) * perspective;

                // Puddle base (dark reflection)
                const puddleGrad = this.ctx.createRadialGradient(x, y, 0, x, y, w);
                puddleGrad.addColorStop(0, 'rgba(100, 150, 200, 0.4)');
                puddleGrad.addColorStop(0.5, 'rgba(50, 80, 130, 0.3)');
                puddleGrad.addColorStop(1, 'rgba(30, 50, 80, 0.1)');
                this.ctx.fillStyle = puddleGrad;
                this.ctx.beginPath();
                this.ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
                this.ctx.fill();

                // Shimmer highlight
                const shimmerX = x + Math.sin(p.shimmer) * w * 0.3;
                const shimmerAlpha = 0.3 + Math.sin(p.shimmer * 2) * 0.2;
                this.ctx.fillStyle = `rgba(200, 220, 255, ${shimmerAlpha})`;
                this.ctx.beginPath();
                this.ctx.ellipse(shimmerX, y - h * 0.2, w * 0.2, h * 0.3, 0, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }
        if (this.weather === 'snow') {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.snowflakes.forEach(s => {
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, 2 + Math.sin(s.wobble) * 1, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }
    }

    drawAchievement() {
        if (this.newAchievement) {
            const a = this.newAchievement;
            this.ctx.globalAlpha = Math.min(1, a.timer / 30);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            this.ctx.beginPath();
            this.ctx.roundRect(this.centerX - 180, 80, 360, 70, 15);
            this.ctx.fill();
            this.ctx.strokeStyle = '#fbbf24';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.font = 'bold 22px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🏆 ACHIEVEMENT!', this.centerX, 108);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '18px Arial';
            this.ctx.fillText(a.name, this.centerX, 135);
            this.ctx.globalAlpha = 1;
        }
    }

    unlockAchievement(id, name) {
        if (this.achievements[id]) return;
        this.achievements[id] = true;
        localStorage.setItem('anatomyAchievements', JSON.stringify(this.achievements));
        this.newAchievement = { id, name, timer: 180 };
    }

    // AWARD-WINNING BACKGROUND - Cyberpunk Night City Aesthetic
    drawBackground() {
        const horizonY = this.height * 0.4;
        const t = this.globalTime * 0.001; // Slow time for subtle animations

        // ═══════════════════════════════════════════════════════════════
        // 1. DEEP SPACE GRADIENT - Rich purples and teals
        // ═══════════════════════════════════════════════════════════════
        const skyGrad = this.ctx.createLinearGradient(0, 0, 0, horizonY + 60);
        skyGrad.addColorStop(0, '#020206');       // Near void
        skyGrad.addColorStop(0.15, '#0a0a1a');    // Deep space
        skyGrad.addColorStop(0.35, '#0d1a2d');    // Midnight blue
        skyGrad.addColorStop(0.55, '#1a2a40');    // Deep ocean
        skyGrad.addColorStop(0.75, '#2d2045');    // Purple dusk
        skyGrad.addColorStop(0.9, '#4a2850');     // Vibrant purple
        skyGrad.addColorStop(1, '#3a1a35');       // Dark magenta
        this.ctx.fillStyle = skyGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // ═══════════════════════════════════════════════════════════════
        // 2. AURORA BOREALIS - Flowing color bands
        // ═══════════════════════════════════════════════════════════════
        if (!this.auroraWaves) {
            this.auroraWaves = [];
            for (let i = 0; i < 3; i++) {
                this.auroraWaves.push({
                    y: 30 + i * 40,
                    amplitude: 15 + Math.random() * 10,
                    frequency: 0.003 + Math.random() * 0.002,
                    phase: Math.random() * Math.PI * 2,
                    color: i === 0 ? 'rgba(0, 255, 180, 0.08)' :
                        i === 1 ? 'rgba(100, 200, 255, 0.06)' :
                            'rgba(180, 100, 255, 0.05)',
                    width: 25 + i * 15
                });
            }
        }
        this.auroraWaves.forEach(wave => {
            this.ctx.beginPath();
            this.ctx.moveTo(0, wave.y);
            for (let x = 0; x <= this.width; x += 20) {
                const y = wave.y + Math.sin(x * wave.frequency + t + wave.phase) * wave.amplitude;
                this.ctx.lineTo(x, y);
            }
            this.ctx.lineTo(this.width, wave.y + wave.width);
            this.ctx.lineTo(0, wave.y + wave.width);
            this.ctx.closePath();
            const auroraGrad = this.ctx.createLinearGradient(0, wave.y, 0, wave.y + wave.width);
            auroraGrad.addColorStop(0, 'transparent');
            auroraGrad.addColorStop(0.5, wave.color);
            auroraGrad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = auroraGrad;
            this.ctx.fill();
        });

        // ═══════════════════════════════════════════════════════════════
        // 3. CRESCENT MOON with atmospheric halo
        // ═══════════════════════════════════════════════════════════════
        const moonX = this.width * 0.8;
        const moonY = 70;
        const moonR = 25;

        // Outer glow layers
        for (let i = 4; i > 0; i--) {
            const glowR = moonR + i * 15;
            const glowGrad = this.ctx.createRadialGradient(moonX, moonY, moonR, moonX, moonY, glowR);
            glowGrad.addColorStop(0, `rgba(255, 240, 220, ${0.03 / i})`);
            glowGrad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = glowGrad;
            this.ctx.beginPath();
            this.ctx.arc(moonX, moonY, glowR, 0, Math.PI * 2);
            this.ctx.fill();
        }
        // Moon body
        const moonGrad = this.ctx.createRadialGradient(moonX - 5, moonY - 5, 2, moonX, moonY, moonR);
        moonGrad.addColorStop(0, '#fffef8');
        moonGrad.addColorStop(0.6, '#e8e4d8');
        moonGrad.addColorStop(1, '#c8c4b0');
        this.ctx.fillStyle = moonGrad;
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
        this.ctx.fill();
        // Crescent shadow
        this.ctx.fillStyle = '#0d1a2d';
        this.ctx.beginPath();
        this.ctx.arc(moonX + 12, moonY - 4, moonR * 0.9, 0, Math.PI * 2);
        this.ctx.fill();

        // ═══════════════════════════════════════════════════════════════
        // 4. STARS with varied sizes and twinkle
        // ═══════════════════════════════════════════════════════════════
        if (!this.staticStars) {
            this.staticStars = [];
            for (let i = 0; i < 60; i++) {
                this.staticStars.push({
                    x: Math.random() * this.width,
                    y: Math.random() * horizonY * 0.7,
                    size: Math.random() < 0.9 ? Math.random() * 1 + 0.3 : Math.random() * 2 + 1.5,
                    twinkleSpeed: 0.5 + Math.random() * 2,
                    twinklePhase: Math.random() * Math.PI * 2,
                    color: Math.random() < 0.8 ? '#ffffff' : Math.random() < 0.5 ? '#a0d0ff' : '#ffd0a0'
                });
            }
        }
        this.staticStars.forEach(s => {
            const twinkle = 0.4 + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.3;
            this.ctx.fillStyle = s.color.replace('ff', Math.floor(twinkle * 255).toString(16).padStart(2, '0'));
            this.ctx.globalAlpha = twinkle;
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;

        // ═══════════════════════════════════════════════════════════════
        // 5. SHOOTING STARS (occasional)
        // ═══════════════════════════════════════════════════════════════
        if (!this.shootingStars) {
            this.shootingStars = [];
            for (let i = 0; i < 3; i++) {
                this.shootingStars.push({
                    x: Math.random() * this.width,
                    y: Math.random() * horizonY * 0.4,
                    length: 40 + Math.random() * 60,
                    angle: 0.5 + Math.random() * 0.3
                });
            }
        }
        const shootFrame = Math.floor(t * 0.5) % 300;
        if (shootFrame < 3) {
            const star = this.shootingStars[shootFrame % 3];
            const progress = (t * 0.5) % 1;
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - progress})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            const sx = star.x + progress * 200;
            const sy = star.y + progress * 100;
            this.ctx.moveTo(sx, sy);
            this.ctx.lineTo(sx - star.length * Math.cos(star.angle), sy - star.length * Math.sin(star.angle));
            this.ctx.stroke();
        }

        // ═══════════════════════════════════════════════════════════════
        // 6. DISTANT CITY GLOW - Cyberpunk light pollution
        // ═══════════════════════════════════════════════════════════════
        const cityGlow = this.ctx.createRadialGradient(this.centerX, horizonY + 20, 0, this.centerX, horizonY, this.width * 0.7);
        cityGlow.addColorStop(0, 'rgba(255, 100, 150, 0.15)');
        cityGlow.addColorStop(0.3, 'rgba(150, 80, 200, 0.1)');
        cityGlow.addColorStop(0.6, 'rgba(80, 60, 150, 0.05)');
        cityGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = cityGlow;
        this.ctx.fillRect(0, horizonY - 100, this.width, 150);

        // ═══════════════════════════════════════════════════════════════
        // 7. CITY BUILDINGS - Layered silhouettes with neon accents
        // ═══════════════════════════════════════════════════════════════
        if (!this.staticWindows) {
            this.staticWindows = [];
            this.neonAccents = [];
            this.buildings.forEach((b, idx) => {
                const bHeight = b.height * 0.65;
                const by = horizonY - bHeight;
                const rows = Math.floor(bHeight / 10);
                const cols = Math.floor(b.width / 7);
                for (let row = 1; row < rows; row++) {
                    for (let col = 1; col < cols; col++) {
                        if (Math.random() < 0.35) {
                            const isNeon = Math.random() < 0.15;
                            this.staticWindows.push({
                                x: b.x + col * 7 + 1,
                                y: by + row * 10 + 1,
                                w: isNeon ? 5 : 3,
                                h: isNeon ? 3 : 4,
                                color: isNeon
                                    ? `rgba(${Math.random() < 0.5 ? '255, 50, 150' : '50, 200, 255'}, 0.8)`
                                    : `rgba(255, ${210 + Math.random() * 40}, ${160 + Math.random() * 40}, ${0.15 + Math.random() * 0.2})`
                            });
                        }
                    }
                }
                // Neon signs on some buildings
                if (Math.random() < 0.3 && b.width > 40) {
                    this.neonAccents.push({
                        x: b.x + b.width * 0.3,
                        y: by + 15,
                        w: b.width * 0.4,
                        h: 8,
                        color: Math.random() < 0.5 ? '#ff1493' : '#00ffff'
                    });
                }
            });
        }

        // Draw buildings
        this.buildings.forEach(b => {
            const bHeight = b.height * 0.65;
            const by = horizonY - bHeight;
            const bGrad = this.ctx.createLinearGradient(b.x, by, b.x, horizonY);
            bGrad.addColorStop(0, 'rgba(15, 20, 35, 0.6)');
            bGrad.addColorStop(0.4, 'rgba(25, 30, 50, 0.75)');
            bGrad.addColorStop(0.8, 'rgba(35, 40, 60, 0.85)');
            bGrad.addColorStop(1, 'rgba(45, 50, 70, 0.9)');
            this.ctx.fillStyle = bGrad;
            this.ctx.fillRect(b.x, by, b.width, bHeight);
            // Building edge highlight
            this.ctx.strokeStyle = 'rgba(100, 80, 150, 0.2)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(b.x, by, b.width, bHeight);
        });

        // Draw windows
        this.staticWindows.forEach(w => {
            this.ctx.fillStyle = w.color;
            this.ctx.fillRect(w.x, w.y, w.w, w.h);
        });

        // Draw neon signs with glow
        this.neonAccents.forEach(n => {
            this.ctx.shadowColor = n.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fillStyle = n.color;
            this.ctx.fillRect(n.x, n.y, n.w, n.h);
            this.ctx.shadowBlur = 0;
        });

        // ═══════════════════════════════════════════════════════════════
        // 8. FLOATING PARTICLES - Atmospheric dust/light motes
        // ═══════════════════════════════════════════════════════════════
        if (!this.dustParticles) {
            this.dustParticles = [];
            for (let i = 0; i < 30; i++) {
                this.dustParticles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * horizonY,
                    size: Math.random() * 2 + 0.5,
                    speedY: -0.1 - Math.random() * 0.3,
                    drift: Math.random() * Math.PI * 2
                });
            }
        }
        this.dustParticles.forEach(p => {
            const px = p.x + Math.sin(t + p.drift) * 20;
            const py = (p.y + t * 10 * p.speedY) % horizonY;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.1})`;
            this.ctx.beginPath();
            this.ctx.arc(px, py < 0 ? py + horizonY : py, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // ═══════════════════════════════════════════════════════════════
        // 9. HORIZON FOG - Seamless blend into road
        // ═══════════════════════════════════════════════════════════════
        const fogGrad = this.ctx.createLinearGradient(0, horizonY - 100, 0, horizonY + 100);
        fogGrad.addColorStop(0, 'transparent');
        fogGrad.addColorStop(0.35, 'rgba(30, 25, 45, 0.4)');
        fogGrad.addColorStop(0.5, 'rgba(22, 20, 38, 0.7)');
        fogGrad.addColorStop(0.7, 'rgba(15, 15, 28, 0.9)');
        fogGrad.addColorStop(1, 'rgba(12, 12, 22, 0.98)');
        this.ctx.fillStyle = fogGrad;
        this.ctx.fillRect(0, horizonY - 100, this.width, 200);
    }

    drawRoad() {
        const horizonY = this.height * 0.4;
        const roadW = 540;

        // Road surface - matches fog end color and fades in smoothly
        const roadGrad = this.ctx.createLinearGradient(0, horizonY, 0, this.height);
        roadGrad.addColorStop(0, 'rgba(15, 18, 28, 0)');      // Transparent at horizon (blends with fog)
        roadGrad.addColorStop(0.1, 'rgba(18, 22, 32, 0.5)');  // Fade in
        roadGrad.addColorStop(0.25, 'rgba(20, 25, 35, 0.85)'); // Getting solid
        roadGrad.addColorStop(0.5, '#151a24');                 // Solid dark road
        roadGrad.addColorStop(1, '#0f1318');                   // Darkest at bottom
        this.ctx.fillStyle = roadGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 120, horizonY);
        this.ctx.lineTo(this.centerX + 120, horizonY);
        this.ctx.lineTo(this.centerX + roadW, this.height);
        this.ctx.lineTo(this.centerX - roadW, this.height);
        this.ctx.fill();

        // Neon Edges
        const edgeGrad = this.ctx.createLinearGradient(0, horizonY, 0, this.height);
        edgeGrad.addColorStop(0, 'rgba(99, 102, 241, 0)');
        edgeGrad.addColorStop(0.3, 'rgba(99, 102, 241, 0.5)');
        edgeGrad.addColorStop(1, '#6366f1');

        this.ctx.strokeStyle = edgeGrad;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 120, horizonY);
        this.ctx.lineTo(this.centerX - roadW, this.height);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 120, horizonY);
        this.ctx.lineTo(this.centerX + roadW, this.height);
        this.ctx.stroke();

        // Lane Dividers
        this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        this.ctx.lineWidth = 2;
        for (let lane = 0; lane < 2; lane++) {
            const offset = (lane - 0.5) * this.laneWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX + offset * 0.2, horizonY);
            this.ctx.lineTo(this.centerX + offset, this.height);
            this.ctx.stroke();
        }

        // SIDE GROUND ZONES - Blend road edges into background naturally
        // Left side gradient (from road edge outward)
        const leftBlend = this.ctx.createLinearGradient(this.centerX - roadW - 150, 0, this.centerX - roadW + 50, 0);
        leftBlend.addColorStop(0, 'rgba(12, 12, 22, 0)');     // Transparent (background visible)
        leftBlend.addColorStop(0.6, 'rgba(15, 15, 25, 0.4)'); // Gradual blend
        leftBlend.addColorStop(1, 'rgba(18, 18, 28, 0.8)');   // Near road edge
        this.ctx.fillStyle = leftBlend;
        this.ctx.beginPath();
        this.ctx.moveTo(0, horizonY);
        this.ctx.lineTo(this.centerX - 120, horizonY);
        this.ctx.lineTo(this.centerX - roadW, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.fill();

        // Right side gradient (from road edge outward)
        const rightBlend = this.ctx.createLinearGradient(this.centerX + roadW - 50, 0, this.centerX + roadW + 150, 0);
        rightBlend.addColorStop(0, 'rgba(18, 18, 28, 0.8)');  // Near road edge
        rightBlend.addColorStop(0.4, 'rgba(15, 15, 25, 0.4)'); // Gradual blend
        rightBlend.addColorStop(1, 'rgba(12, 12, 22, 0)');    // Transparent (background visible)
        this.ctx.fillStyle = rightBlend;
        this.ctx.beginPath();
        this.ctx.moveTo(this.width, horizonY);
        this.ctx.lineTo(this.centerX + 120, horizonY);
        this.ctx.lineTo(this.centerX + roadW, this.height);
        this.ctx.lineTo(this.width, this.height);
        this.ctx.fill();
    }

    drawObstacles() {
        const horizonY = this.height * 0.4;
        [...this.obstacles].sort((a, b) => b.z - a.z).forEach(obs => {
            if (obs.z < 0 || obs.z > 2200) return;
            const zn = obs.z / 2200, p = 1 / (1 + zn * 5);
            const y = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (obs.lane - 1) * this.laneWidth * p;
            const w = 80 * p, h = (obs.type === 'high' ? 55 : 105) * p;
            this.ctx.save();
            const color = obs.type === 'moving' ? '#a855f7' : obs.type === 'high' ? '#f59e0b' : '#ef4444';
            this.ctx.shadowColor = color; this.ctx.shadowBlur = 28 * p;
            if (obs.type === 'high') {
                const hy = y - 90 * p;
                this.ctx.fillStyle = '#92400e'; this.ctx.fillRect(x - w / 2 + 6 * p, hy - h + 6 * p, w, h);
                this.ctx.fillStyle = '#f59e0b'; this.ctx.fillRect(x - w / 2, hy - h, w, h);
                this.ctx.fillStyle = '#451a03'; for (let s = 0; s < 4; s++) this.ctx.fillRect(x - w / 2 + s * w / 4, hy - h, w / 8, h);
            } else {
                this.ctx.fillStyle = obs.type === 'moving' ? '#581c87' : '#7f1d1d';
                this.ctx.fillRect(x - w / 2 + 6 * p, y - h + 6 * p, w - 6 * p, h - 12 * p);
                this.ctx.fillStyle = color; this.ctx.fillRect(x - w / 2, y - h, w - 6 * p, h - 12 * p);
                this.ctx.fillStyle = obs.type === 'moving' ? '#2e1065' : '#450a0a';
                for (let s = 0; s < 4; s++) this.ctx.fillRect(x - w / 2 + s * w / 4, y - h, w / 8, h - 12 * p);
            }
            this.ctx.restore();
        });
    }

    drawCoins() {
        const horizonY = this.height * 0.4;
        this.coins_arr.forEach(c => {
            if (c.collected || c.z < 0 || c.z > 2200) return;
            const zn = c.z / 2200, p = 1 / (1 + zn * 5);
            const baseY = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (c.lane - 1) * this.laneWidth * p;
            const y = baseY - (55 + (c.elevated ? 100 : 0)) * p + Math.sin(c.bob) * 7 * p;
            const coinSize = 22 * p;

            // Pulsing glow
            const pulse = 0.7 + Math.sin(this.globalTime * 0.008 + c.bob) * 0.3;

            this.ctx.save();
            this.ctx.shadowColor = '#fbbf24';
            this.ctx.shadowBlur = 35 * p * pulse;

            // 3D coin gradient
            const coinGrad = this.ctx.createRadialGradient(x - coinSize * 0.3, y - coinSize * 0.3, 0, x, y, coinSize);
            coinGrad.addColorStop(0, '#fef08a');
            coinGrad.addColorStop(0.4, '#fbbf24');
            coinGrad.addColorStop(0.8, '#f59e0b');
            coinGrad.addColorStop(1, '#b45309');

            this.ctx.fillStyle = coinGrad;
            this.ctx.beginPath();
            this.ctx.arc(x, y, coinSize, 0, Math.PI * 2);
            this.ctx.fill();

            // Inner highlight ring
            this.ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
            this.ctx.lineWidth = 2 * p;
            this.ctx.beginPath();
            this.ctx.arc(x, y, coinSize * 0.65, 0, Math.PI * 2);
            this.ctx.stroke();

            // $ symbol
            this.ctx.fillStyle = '#451a03';
            this.ctx.font = `bold ${18 * p}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('$', x, y);

            // Sparkle particles around coin
            if (Math.random() < 0.08 && p > 0.3) {
                const angle = Math.random() * Math.PI * 2;
                const dist = coinSize + Math.random() * 10;
                this.particles.push({
                    x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist,
                    vx: Math.cos(angle) * 1.5, vy: Math.sin(angle) * 1.5 - 1,
                    size: 2 + Math.random() * 3, life: 15 + Math.random() * 10,
                    color: '#fef08a', type: 'sparkle'
                });
            }

            this.ctx.restore();
        });
    }

    drawPowerups() {
        const horizonY = this.height * 0.4;
        const icons = { shield: '🛡️', magnet: '🧲', speed: '⚡', heart: '❤️', coin_burst: '💰' };
        this.powerups.forEach(p => {
            if (p.collected || p.z < 0 || p.z > 2200) return;
            const zn = p.z / 2200, per = 1 / (1 + zn * 5);
            const baseY = horizonY + (this.height - horizonY) * (1 - Math.pow(zn, 0.55));
            const x = this.centerX + (p.lane - 1) * this.laneWidth * per;
            const y = baseY - 90 * per + Math.sin(p.bob) * 10 * per;
            this.ctx.save(); this.ctx.shadowColor = this.getPowerupColor(p.type); this.ctx.shadowBlur = 30 * per;
            this.ctx.fillStyle = this.getPowerupColor(p.type); this.ctx.globalAlpha = 0.35;
            this.ctx.beginPath(); this.ctx.arc(x, y, 32 * per, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.globalAlpha = 1; this.ctx.font = `${32 * per}px Arial`; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
            this.ctx.fillText(icons[p.type], x, y); this.ctx.restore();
        });
    }

    drawPlayerTrail() {
        // Always show trail during dash or speed boost
        const showTrail = this.player.speedBoost > 0 || this.player.isDashing;
        if (showTrail && this.player.trail.length > 0) {
            const trailColor = this.player.isDashing ? '#f472b6' : '#22c55e';
            this.player.trail.forEach((t, i) => {
                const size = 22 - i * 1.5;
                if (size <= 0) return;

                // Gradient trail
                const trailGrad = this.ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, size);
                trailGrad.addColorStop(0, trailColor);
                trailGrad.addColorStop(0.5, trailColor.replace(')', ', 0.5)').replace('rgb', 'rgba').replace('#', 'rgba('));
                trailGrad.addColorStop(1, 'transparent');

                this.ctx.globalAlpha = t.alpha * 0.6;
                this.ctx.shadowColor = trailColor;
                this.ctx.shadowBlur = 15;
                this.ctx.fillStyle = trailColor;
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
                this.ctx.fill();
            });
            this.ctx.globalAlpha = 1;
            this.ctx.shadowBlur = 0;
        }

        // Running dust particles
        if (this.state === 'playing' && !this.player.isJumping && Math.random() < 0.15) {
            const px = this.getLaneX(this.currentLane);
            const py = this.height - 30;
            this.particles.push({
                x: px + (Math.random() - 0.5) * 20, y: py,
                vx: (Math.random() - 0.5) * 2, vy: -1 - Math.random() * 2,
                size: 3 + Math.random() * 4, life: 20 + Math.random() * 15,
                color: 'rgba(150, 130, 110, 0.6)', type: 'dust'
            });
        }
    }

    drawPlayer() {
        const x = this.getLaneX(this.currentLane), groundY = this.height - 45, y = groundY - this.player.jumpHeight;
        if (this.player.invincible > 0 && Math.floor(this.player.invincible / 6) % 2 === 0) this.ctx.globalAlpha = 0.5;
        this.ctx.save(); this.ctx.translate(x, y);

        // Get outfit color
        const outfitColor = this.getOutfitColor();
        const pantsColor = this.getDarkerColor(outfitColor);

        // Dynamic glow based on power-ups or outfit
        let glow = 'rgba(0,0,0,0.3)';
        if (this.player.shield > 0) glow = '#06b6d4';
        if (this.player.speedBoost > 0) glow = '#22c55e';
        if (this.player.magnet > 0) glow = '#a855f7';
        if (this.player.isDashing) glow = '#f472b6';
        this.ctx.shadowColor = glow; this.ctx.shadowBlur = this.player.isDashing ? 45 : 15;

        const bounce = this.player.isJumping ? 0 : Math.sin(this.player.animFrame * 0.6) * 5;
        const armSwing = Math.sin(this.player.animFrame * 0.8) * 28;
        const legSwing = Math.sin(this.player.animFrame * 0.8) * 24;
        const hairBounce = Math.sin(this.player.animFrame * 0.5) * 4;

        if (this.player.isSliding) {
            // Sliding pose - compressed
            this.ctx.fillStyle = outfitColor;
            this.ctx.beginPath(); this.ctx.ellipse(0, -18, 55, 22, 0, 0, Math.PI * 2); this.ctx.fill();
            // Head
            const headGrad = this.ctx.createRadialGradient(25, -35, 2, 30, -30, 22);
            headGrad.addColorStop(0, '#ffe4c4'); headGrad.addColorStop(1, '#eaa');
            this.ctx.fillStyle = headGrad;
            this.ctx.beginPath(); this.ctx.arc(30, -30, 20, 0, Math.PI * 2); this.ctx.fill();
            // Ponytail flowing back
            this.ctx.fillStyle = '#5d4037';
            this.ctx.beginPath(); this.ctx.ellipse(-15, -28, 30, 10, -0.3, 0, Math.PI * 2); this.ctx.fill();
        } else {
            // LEGS - Forward running motion (lift up/down, not side-to-side)
            const legLift = Math.abs(legSwing); // How high the leg lifts (0-24)
            const legPhase = legSwing > 0; // Which leg is forward

            const legLGrad = this.ctx.createLinearGradient(-15, 0, -5, 0);
            legLGrad.addColorStop(0, '#1e293b'); legLGrad.addColorStop(0.5, pantsColor); legLGrad.addColorStop(1, '#1e293b');
            const legRGrad = this.ctx.createLinearGradient(5, 0, 15, 0);
            legRGrad.addColorStop(0, '#1e293b'); legRGrad.addColorStop(0.5, pantsColor); legRGrad.addColorStop(1, '#1e293b');

            // Left leg - lifts when phase is true (forward kick)
            this.ctx.save();
            const leftLift = legPhase ? legLift * 0.5 : 0; // Lift amount
            const leftScale = legPhase ? 0.92 : 1; // Smaller when forward (depth)
            this.ctx.translate(-12, -18 + bounce - leftLift);
            this.ctx.scale(1, leftScale);
            this.ctx.fillStyle = legLGrad;
            this.ctx.fillRect(-7, 0, 14, 42);
            this.ctx.fillStyle = '#f8fafc'; this.ctx.fillRect(-8, 38, 16, 12); // Shoe
            this.ctx.restore();

            // Right leg - lifts when phase is false (forward kick)
            this.ctx.save();
            const rightLift = !legPhase ? legLift * 0.5 : 0;
            const rightScale = !legPhase ? 0.92 : 1;
            this.ctx.translate(12, -18 + bounce - rightLift);
            this.ctx.scale(1, rightScale);
            this.ctx.fillStyle = legRGrad;
            this.ctx.fillRect(-7, 0, 14, 42);
            this.ctx.fillStyle = '#f8fafc'; this.ctx.fillRect(-8, 38, 16, 12); // Shoe
            this.ctx.restore();

            // BODY - feminine scrubs with shading
            const bodyGrad = this.ctx.createLinearGradient(-25, -80, 25, -80);
            bodyGrad.addColorStop(0, this.getDarkerColor(outfitColor)); bodyGrad.addColorStop(0.2, outfitColor); bodyGrad.addColorStop(0.8, outfitColor); bodyGrad.addColorStop(1, this.getDarkerColor(outfitColor));
            this.ctx.fillStyle = bodyGrad;
            this.ctx.beginPath();
            this.ctx.moveTo(-22, -85 + bounce);
            this.ctx.quadraticCurveTo(-28, -50 + bounce, -20, -18 + bounce);
            this.ctx.lineTo(20, -18 + bounce);
            this.ctx.quadraticCurveTo(28, -50 + bounce, 22, -85 + bounce);
            this.ctx.closePath();
            this.ctx.fill();

            // V-neck detail
            this.ctx.fillStyle = '#e2e8f0'; // Undershirt
            this.ctx.beginPath(); this.ctx.moveTo(-10, -85 + bounce); this.ctx.lineTo(0, -75 + bounce); this.ctx.lineTo(10, -85 + bounce); this.ctx.fill();
            this.ctx.strokeStyle = pantsColor; this.ctx.lineWidth = 2;
            this.ctx.beginPath(); this.ctx.moveTo(-10, -85 + bounce); this.ctx.lineTo(0, -70 + bounce); this.ctx.lineTo(10, -85 + bounce); this.ctx.stroke();

            // ID Badge
            this.ctx.fillStyle = '#fff'; this.ctx.fillRect(-18, -65 + bounce, 10, 7);
            this.ctx.fillStyle = '#000'; this.ctx.fillRect(-17, -64 + bounce, 4, 4); // Photo
            this.ctx.fillStyle = '#94a3b8'; this.ctx.fillRect(-12, -64 + bounce, 3, 2); // Text

            // Pocket with pens
            this.ctx.strokeStyle = this.getDarkerColor(outfitColor); this.ctx.lineWidth = 1;
            this.ctx.strokeRect(10, -60 + bounce, 10, 12);
            this.ctx.fillStyle = '#ef4444'; this.ctx.fillRect(12, -65 + bounce, 2, 8); // Red pen
            this.ctx.fillStyle = '#3b82f6'; this.ctx.fillRect(16, -65 + bounce, 2, 8); // Blue pen

            // ARMS - Left arm
            this.ctx.save(); this.ctx.translate(-26, -75 + bounce); this.ctx.rotate(-armSwing * Math.PI / 180);
            this.ctx.beginPath(); this.ctx.fillStyle = outfitColor; this.ctx.roundRect(-6, 0, 12, 30, 4); this.ctx.fill();
            this.ctx.fillStyle = '#ffe4c4'; this.ctx.beginPath(); this.ctx.arc(0, 34, 7, 0, Math.PI * 2); this.ctx.fill(); // Hand
            this.ctx.restore();

            // ARMS - Right arm
            this.ctx.save(); this.ctx.translate(26, -75 + bounce); this.ctx.rotate(armSwing * Math.PI / 180);
            this.ctx.beginPath(); this.ctx.fillStyle = outfitColor; this.ctx.roundRect(-6, 0, 12, 30, 4); this.ctx.fill();
            this.ctx.fillStyle = '#ffe4c4'; this.ctx.beginPath(); this.ctx.arc(0, 34, 7, 0, Math.PI * 2); this.ctx.fill(); // Hand
            this.ctx.restore();

            // STETHOSCOPE - Realistic Asymmetric Drape
            const stethColor = '#cbd5e1'; // Light silver
            const stethShadow = 'rgba(0,0,0,0.3)';
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';

            // 1. Neck Loop (Behind/On Shoulders)
            this.ctx.strokeStyle = stethColor;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(-15, -86 + bounce);
            this.ctx.quadraticCurveTo(0, -82 + bounce, 15, -86 + bounce);
            this.ctx.stroke();

            // 2. RIGHT SIDE (Screen Left) - Chest Piece Side
            // Tube hangs down
            this.ctx.beginPath();
            this.ctx.moveTo(-15, -86 + bounce);
            this.ctx.quadraticCurveTo(-18, -70 + bounce, -14, -55 + bounce);
            this.ctx.stroke();

            // Chest Piece (Metallic Disc + Diaphragm)
            // Metal Casing
            this.ctx.fillStyle = '#94a3b8';
            this.ctx.beginPath(); this.ctx.arc(-14, -50 + bounce, 7, 0, Math.PI * 2); this.ctx.fill();
            // White Diaphragm
            const diaGrad = this.ctx.createRadialGradient(-14, -50 + bounce, 1, -14, -50 + bounce, 5);
            diaGrad.addColorStop(0, '#ffffff'); diaGrad.addColorStop(1, '#e2e8f0');
            this.ctx.fillStyle = diaGrad;
            this.ctx.beginPath(); this.ctx.arc(-14, -50 + bounce, 5, 0, Math.PI * 2); this.ctx.fill();

            // 3. LEFT SIDE (Screen Right) - Headset Side
            // Tube hangs down to Y-Junction
            this.ctx.beginPath();
            this.ctx.moveTo(15, -86 + bounce);
            this.ctx.quadraticCurveTo(18, -75 + bounce, 16, -65 + bounce);
            this.ctx.stroke();

            // Y-Junction (The metal V-shape)
            this.ctx.fillStyle = '#64748b'; // Darker metal
            this.ctx.beginPath();
            this.ctx.moveTo(16, -65 + bounce);
            this.ctx.lineTo(12, -55 + bounce); // Left ear tube start
            this.ctx.lineTo(20, -55 + bounce); // Right ear tube start
            this.ctx.fill();

            // Ear Tubes & Tips hanging down
            this.ctx.strokeStyle = '#94a3b8'; this.ctx.lineWidth = 2;
            // Left Ear Tube
            this.ctx.beginPath(); this.ctx.moveTo(12, -55 + bounce);
            this.ctx.quadraticCurveTo(10, -50 + bounce, 11, -45 + bounce); this.ctx.stroke();
            this.ctx.fillStyle = '#475569'; this.ctx.beginPath(); this.ctx.arc(11, -44 + bounce, 2, 0, Math.PI * 2); this.ctx.fill(); // Tip
            // Right Ear Tube
            this.ctx.beginPath(); this.ctx.moveTo(20, -55 + bounce);
            this.ctx.quadraticCurveTo(22, -50 + bounce, 21, -45 + bounce); this.ctx.stroke();
            this.ctx.fillStyle = '#475569'; this.ctx.beginPath(); this.ctx.arc(21, -44 + bounce, 2, 0, Math.PI * 2); this.ctx.fill(); // Tip

            // HEAD - BACK VIEW (character running INTO screen, we see the back)
            // Base head shape
            const headGrad = this.ctx.createRadialGradient(0, -105 + bounce, 5, 0, -105 + bounce, 24);
            headGrad.addColorStop(0, '#dec0a8'); headGrad.addColorStop(1, '#c9a889');
            this.ctx.fillStyle = headGrad;
            this.ctx.beginPath(); this.ctx.arc(0, -105 + bounce, 24, 0, Math.PI * 2); this.ctx.fill();

            // HAIR - Full back coverage (we see the back of head)
            this.ctx.fillStyle = '#3e2723';
            // Main hair mass covering back of head
            this.ctx.beginPath();
            this.ctx.arc(0, -108 + bounce, 26, 0, Math.PI * 2);
            this.ctx.fill();

            // Hair highlight for volume
            this.ctx.fillStyle = '#5d4037';
            this.ctx.beginPath();
            this.ctx.ellipse(0, -115 + bounce, 20, 12, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Small ears peeking out from hair
            this.ctx.fillStyle = '#dec0a8';
            this.ctx.beginPath(); this.ctx.ellipse(-24, -105 + bounce, 4, 6, 0, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.beginPath(); this.ctx.ellipse(24, -105 + bounce, 4, 6, 0, 0, Math.PI * 2); this.ctx.fill();

            // PONYTAIL - Large and flowing back (bouncing with running)
            this.ctx.fillStyle = '#3e2723';
            this.ctx.beginPath();
            this.ctx.moveTo(0, -125 + bounce);
            this.ctx.quadraticCurveTo(-10 - hairBounce, -115 + bounce, -15 - hairBounce * 1.5, -80 + bounce);
            this.ctx.quadraticCurveTo(-5, -95 + bounce, 5, -95 + bounce);
            this.ctx.quadraticCurveTo(0, -110 + bounce, 0, -125 + bounce);
            this.ctx.fill();

            // Ponytail hair tie
            this.ctx.fillStyle = '#f472b6';
            this.ctx.beginPath(); this.ctx.ellipse(-2, -120 + bounce, 5, 3, -0.2, 0, Math.PI * 2); this.ctx.fill();

            // Nurse cap (on back of head, slightly tilted back)
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.beginPath();
            this.ctx.moveTo(-16, -130 + bounce);
            this.ctx.lineTo(16, -130 + bounce);
            this.ctx.lineTo(20, -140 + bounce);
            this.ctx.lineTo(0, -145 + bounce);
            this.ctx.lineTo(-20, -140 + bounce);
            this.ctx.closePath();
            this.ctx.fill();
            // Red cross on cap
            this.ctx.fillStyle = '#ef4444';
            this.ctx.shadowColor = '#ef4444'; this.ctx.shadowBlur = 5;
            this.ctx.fillRect(-4, -142 + bounce, 8, 8);
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(-2, -140 + bounce, 4, 4);
            this.ctx.fillStyle = '#ef4444';
            this.ctx.fillRect(-1, -140 + bounce, 2, 4);
            this.ctx.fillRect(-2, -139 + bounce, 4, 2);
            this.ctx.shadowBlur = 0;

            // Shield effect
            if (this.player.shield > 0) {
                this.ctx.strokeStyle = '#06b6d4'; this.ctx.lineWidth = 4;
                this.ctx.globalAlpha = 0.5 + Math.sin(this.globalTime * 0.015) * 0.3;
                this.ctx.beginPath(); this.ctx.arc(0, -60 + bounce, 75, 0, Math.PI * 2); this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        }
        this.ctx.restore();

        if (this.player.isDashing) {
            this.ctx.save(); this.ctx.translate(x, y);
            this.ctx.strokeStyle = '#f472b6'; this.ctx.lineWidth = 3;
            for (let i = 1; i <= 3; i++) {
                this.ctx.globalAlpha = 0.3 / i;
                this.ctx.beginPath(); this.ctx.arc(0 - i * 15, -60, 50, 0, Math.PI * 2); this.ctx.stroke();
            }
            this.ctx.restore();
            this.ctx.globalAlpha = 1;
        }
    }

    drawParticles() {
        this.particles.forEach(p => { this.ctx.globalAlpha = p.life / 50; this.ctx.fillStyle = p.color; this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); this.ctx.fill(); });
        this.ctx.globalAlpha = 1;
    }

    drawFloatingTexts() {
        this.floatingTexts.forEach(t => {
            this.ctx.globalAlpha = t.life / 60;
            this.ctx.fillStyle = t.color; this.ctx.font = 'bold 28px Arial'; this.ctx.textAlign = 'center';
            this.ctx.fillText(t.text, t.x, t.y);
        });
        this.ctx.globalAlpha = 1;
    }

    drawHUD() {
        const hudFont = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial';
        const numFont = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial';

        // Score Pill (Top Left)
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.6)'; this.ctx.strokeStyle = 'rgba(255,255,255,0.1)'; this.ctx.lineWidth = 1;
        this.ctx.beginPath(); this.ctx.roundRect(20, 20, 180, 80, 12); this.ctx.fill(); this.ctx.stroke();

        this.ctx.fillStyle = '#94a3b8'; this.ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial'; this.ctx.textAlign = 'left';
        this.ctx.fillText('SCORE', 36, 44);
        this.ctx.fillStyle = '#fff'; this.ctx.font = numFont;
        this.ctx.fillText(this.score.toLocaleString(), 36, 74);

        if (this.multiplier > 1) {
            this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 18px Arial';
            this.ctx.fillText(`x${this.multiplier}`, 160, 74);
        }

        // Stats Pill (Top Right)
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        this.ctx.beginPath(); this.ctx.roundRect(this.width - 220, 20, 200, 80, 12); this.ctx.fill(); this.ctx.stroke();

        // Coins
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#fbbf24'; this.ctx.font = '20px Arial';
        this.ctx.fillText(`💰 ${this.coins}`, this.width - 36, 50);

        // Lives
        let hearts = ''; for (let i = 0; i < Math.min(this.lives, 5); i++) hearts += '❤️'; for (let i = this.lives; i < 3; i++) hearts += '🖤';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(hearts, this.width - 36, 82);

        // Center Status (Streak/Combo)
        if (this.streak > 5 || this.combo > 0) {
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
            this.ctx.beginPath(); this.ctx.roundRect(this.centerX - 100, 20, 200, 45, 22.5); this.ctx.fill();

            this.ctx.fillStyle = '#22c55e'; this.ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
            let txt = '';
            if (this.streak > 5) txt = `🔥 ${this.streak} STREAK`;
            if (this.combo > 0) txt += (txt ? '  •  ' : '') + `${this.combo}x COMBO`;
            this.ctx.fillText(txt, this.centerX, 48);
        }

        // Fever / Special Text
        if (this.feverMode) {
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#f472b6'; this.ctx.font = 'bold 24px Arial';
            this.ctx.shadowColor = '#f472b6'; this.ctx.shadowBlur = 10;
            this.ctx.fillText(`🔥 FEVER MODE ${Math.ceil(this.feverTimer / 60)}s`, this.centerX, 100);
            this.ctx.shadowBlur = 0;
        }

        let py = 150;
        if (this.player.shield > 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#06b6d4'; this.ctx.font = '24px Arial'; this.ctx.fillText(`🛡️ ${Math.ceil(this.player.shield / 60)} s`, this.width - 40, py); py += 32; }
        if (this.player.magnet > 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#a855f7'; this.ctx.font = '24px Arial'; this.ctx.fillText(`🧲 ${Math.ceil(this.player.magnet / 60)} s`, this.width - 40, py); py += 32; }
        if (this.player.speedBoost > 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#22c55e'; this.ctx.font = '24px Arial'; this.ctx.fillText(`⚡ ${Math.ceil(this.player.speedBoost / 60)} s`, this.width - 40, py); py += 32; }
        if (this.player.dashCooldown <= 0) { this.ctx.textAlign = 'right'; this.ctx.fillStyle = '#f472b6'; this.ctx.font = '20px Arial'; this.ctx.fillText('SHIFT: Dash Ready', this.width - 40, py); }
    }

    drawMenu() {
        try {
            // Dark Radial Vignette Background (Focus center)
            const bgGrad = this.ctx.createRadialGradient(this.centerX, this.height * 0.4, 100, this.centerX, this.height * 0.5, this.width);
            bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
            bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
            this.ctx.fillStyle = bgGrad;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Header Section - Massive Gradient Title
            this.ctx.shadowColor = '#818cf8'; this.ctx.shadowBlur = 80;

            const titleGrad = this.ctx.createLinearGradient(this.centerX - 300, 0, this.centerX + 300, 0);
            titleGrad.addColorStop(0, '#e2e8f0'); titleGrad.addColorStop(0.5, '#ffffff'); titleGrad.addColorStop(1, '#a5b4fc');
            this.ctx.fillStyle = titleGrad;

            this.ctx.font = '900 80px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('MSK REVIEW RUNNER', this.centerX, this.height * 0.22);
            this.ctx.shadowBlur = 0;

            // Subtitle
            this.ctx.fillStyle = '#94a3b8';
            this.ctx.font = '500 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            this.ctx.fillText('Musculoskeletal Nursing Study Guide', this.centerX, this.height * 0.30);

            // Stats Card - Larger and Cleaner
            const statsW = 600;
            const statsX = this.centerX - statsW / 2;
            const statsY = this.height * 0.38;

            // Glass Effect
            this.ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            this.ctx.lineWidth = 1;
            if (this.ctx.roundRect) {
                this.ctx.beginPath(); this.ctx.roundRect(statsX, statsY, statsW, 120, 24); this.ctx.fill(); this.ctx.stroke();
            } else {
                this.ctx.fillRect(statsX, statsY, statsW, 120); this.ctx.strokeRect(statsX, statsY, statsW, 120);
            }

            // High Score
            this.ctx.fillStyle = '#f8fafc'; this.ctx.font = '800 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
            this.ctx.fillText(this.highScore.toLocaleString(), statsX + 150, statsY + 75);
            this.ctx.fillStyle = '#64748b'; this.ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
            this.ctx.fillText('HIGH SCORE', statsX + 150, statsY + 35);

            // Divider
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.beginPath(); this.ctx.moveTo(this.centerX, statsY + 20); this.ctx.lineTo(this.centerX, statsY + 100); this.ctx.stroke();

            // Coins
            this.ctx.fillStyle = '#fbbf24'; this.ctx.font = '800 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
            this.ctx.fillText(this.totalCoins.toLocaleString(), statsX + 450, statsY + 75);
            this.ctx.fillStyle = '#64748b'; this.ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
            this.ctx.fillText('TOTAL COINS', statsX + 450, statsY + 35);

            // Main CTA Button
            const btnY = this.height * 0.65;
            const btnW = 320;
            const btnH = 80;

            // Pulse Effect
            const pulse = 0.5 + Math.sin(this.globalTime * 0.005) * 0.2;
            this.ctx.shadowColor = '#6366f1'; this.ctx.shadowBlur = 40 * pulse + 15;
            this.ctx.fillStyle = '#6366f1';
            if (this.ctx.roundRect) {
                this.ctx.beginPath(); this.ctx.roundRect(this.centerX - btnW / 2, btnY, btnW, btnH, 40); this.ctx.fill();
            } else {
                this.ctx.fillRect(this.centerX - btnW / 2, btnY, btnW, btnH);
            }
            this.ctx.shadowBlur = 0;

            // Button Shine
            const btnGrad = this.ctx.createLinearGradient(this.centerX, btnY, this.centerX, btnY + btnH);
            btnGrad.addColorStop(0, 'rgba(255,255,255,0.2)'); btnGrad.addColorStop(1, 'rgba(255,255,255,0)');
            this.ctx.fillStyle = btnGrad; this.ctx.fill();

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '800 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            this.ctx.fillText('START GAME', this.centerX, btnY + 50);

            // Instructions
            this.ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
            this.ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            this.ctx.fillText('Press SPACE to Start  •  Press O for Outfits  •  Arrows to Move', this.centerX, this.height * 0.90);
        } catch (e) {
            console.error(e);
            this.ctx.fillStyle = '#ef4444'; this.ctx.font = '30px Arial'; this.ctx.textAlign = 'center';
            this.ctx.fillText('ERROR: ' + e.message, this.centerX, this.height / 2);
        }
    }

    drawShop() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.95)'; this.ctx.fillRect(0, 0, this.width, this.height);

        // Title
        this.ctx.shadowColor = '#ec4899'; this.ctx.shadowBlur = 60;
        this.ctx.fillStyle = '#ec4899'; this.ctx.font = 'bold 48px "Space Grotesk", Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText('👗 OUTFIT SHOP', this.centerX, this.height * 0.1); this.ctx.shadowBlur = 0;

        // Coins display
        this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`💰 ${this.totalCoins.toLocaleString()} coins`, this.centerX, this.height * 0.17);

        const outfitKeys = Object.keys(this.outfits);
        const itemHeight = 70;
        const startY = this.height * 0.23;

        outfitKeys.forEach((key, i) => {
            const outfit = this.outfits[key];
            const y = startY + i * itemHeight;
            const isSelected = i === this.shopScroll;
            const isEquipped = this.currentOutfit === key;

            // Background
            const bgAlpha = isSelected ? 0.4 : 0.15;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${bgAlpha})`;
            this.ctx.beginPath();
            this.ctx.roundRect(60, y, this.width - 120, itemHeight - 10, 12);
            this.ctx.fill();

            // Selection border
            if (isSelected) {
                this.ctx.strokeStyle = '#ec4899';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }

            // Color swatch
            const swatchColor = outfit.color === 'rainbow' ?
                `hsl(${(this.globalTime * 0.1) % 360}, 80 %, 55 %)` : outfit.color;
            this.ctx.fillStyle = swatchColor;
            this.ctx.shadowColor = swatchColor;
            this.ctx.shadowBlur = isSelected ? 15 : 8;
            this.ctx.beginPath();
            this.ctx.arc(110, y + 28, 22, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            // Outfit name
            this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 22px Arial'; this.ctx.textAlign = 'left';
            this.ctx.fillText(outfit.name, 150, y + 25);

            // Status / Price
            this.ctx.textAlign = 'right';
            if (outfit.owned) {
                if (isEquipped) {
                    this.ctx.fillStyle = '#22c55e'; this.ctx.font = 'bold 20px Arial';
                    this.ctx.fillText('✓ EQUIPPED', this.width - 80, y + 25);
                } else {
                    this.ctx.fillStyle = '#a855f7'; this.ctx.font = '18px Arial';
                    this.ctx.fillText('OWNED', this.width - 80, y + 25);
                    if (isSelected) {
                        this.ctx.fillStyle = '#06b6d4'; this.ctx.font = '14px Arial';
                        this.ctx.fillText('[ENTER] Equip', this.width - 80, y + 45);
                    }
                }
            } else {
                this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 20px Arial';
                this.ctx.fillText(`💰 ${outfit.price} `, this.width - 80, y + 25);
                if (isSelected) {
                    const canAfford = this.totalCoins >= outfit.price;
                    this.ctx.fillStyle = canAfford ? '#22c55e' : '#ef4444';
                    this.ctx.font = '14px Arial';
                    this.ctx.fillText(canAfford ? '[B] Buy' : 'Not enough coins', this.width - 80, y + 45);
                }
            }
        });

        // Preview character
        this.ctx.save();
        this.ctx.translate(this.centerX, this.height * 0.92);
        const previewColor = this.getOutfitColor();

        // Simple nurse preview
        this.ctx.fillStyle = '#ffd5b4'; // Face
        this.ctx.beginPath(); this.ctx.arc(0, -70, 18, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.fillStyle = previewColor; // Top (scrubs)
        this.ctx.fillRect(-20, -50, 40, 35);
        this.ctx.fillStyle = this.getDarkerColor(previewColor); // Pants
        this.ctx.fillRect(-18, -15, 36, 30);
        this.ctx.restore();

        // Instructions
        this.ctx.fillStyle = '#888'; this.ctx.font = '16px Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText('↑↓ Navigate • [B] Buy • [ENTER] Equip • [ESC] Back', this.centerX, this.height * 0.99);
    }

    drawQuestion() {
        // Timer countdown
        if (this.questionResult === null) {
            this.questionTimer--;
            if (this.questionTimer <= 0) {
                this.questionResult = 'timeout'; this.lives--; this.streak = 0; this.multiplier = 1;
                this.shake = 15; this.flash = { color: '#ef4444', timer: 18 };
                if (this.lives <= 0) setTimeout(() => this.gameOver(), 2500);
                else setTimeout(() => { this.state = 'playing'; this.currentQuestion = null; this.player.invincible = 120; }, 2500);
            }
        }

        // Background
        this.ctx.fillStyle = 'rgba(5,5,20,0.98)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        if (!this.currentQuestion) return;

        // Timer bar
        const pct = this.questionTimer / (this.questionTimeLimit * 60);
        const tc = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#f59e0b' : '#ef4444';
        this.ctx.fillStyle = '#1f2937'; this.ctx.fillRect(70, 20, this.width - 140, 28);
        this.ctx.fillStyle = tc; this.ctx.fillRect(70, 20, (this.width - 140) * pct, 28);
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 20px Arial'; this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.ceil(this.questionTimer / 60)} s`, this.centerX, 42);

        // Question type indicator
        if (this.currentQuestion.type === 'sata') {
            this.ctx.fillStyle = '#a855f7'; this.ctx.font = 'bold 14px Arial';
            this.ctx.fillText('SELECT ALL THAT APPLY', this.centerX, 70);
        }

        // Question text (word-wrapped)
        this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 20px Arial';
        const words = this.currentQuestion.text.split(' ');
        let line = '', y = this.height * 0.12, maxW = this.width * 0.86;
        words.forEach(w => {
            const test = line + w + ' ';
            if (this.ctx.measureText(test).width > maxW && line) {
                this.ctx.fillText(line.trim(), this.centerX, y); line = w + ' '; y += 28;
            } else line = test;
        });
        this.ctx.fillText(line.trim(), this.centerX, y);

        // Options
        const startY = this.height * 0.26, optH = 52, gap = 12, margin = this.width * 0.06;
        const isSATA = this.currentQuestion.type === 'sata';

        this.currentQuestion.options.forEach((opt, i) => {
            const oY = startY + i * (optH + gap);
            let bg = '#1e1e40', border = 'rgba(139, 92, 246, 0.4)';
            const isSelected = isSATA ? this.selectedAnswers.includes(i) : (i === this.selectedAnswer);

            // Before result: show selection state
            if (!this.questionResult && isSelected) {
                bg = '#3730a3'; border = '#6366f1';
            }

            // After result: show correct/wrong
            if (this.questionResult) {
                const isCorrect = isSATA
                    ? this.currentQuestion.correctAnswers.includes(opt)
                    : (opt === this.currentQuestion.correct);

                if (isSelected && isCorrect) { bg = '#166534'; border = '#22c55e'; }
                else if (isSelected && !isCorrect) { bg = '#991b1b'; border = '#ef4444'; }
                else if (!isSelected && isCorrect) { bg = '#14532d'; border = '#22c55e'; } // Missed correct
            }

            // Draw option box
            this.ctx.fillStyle = bg;
            this.ctx.beginPath(); this.ctx.roundRect(margin, oY, this.width - margin * 2, optH, 12); this.ctx.fill();
            this.ctx.strokeStyle = border; this.ctx.lineWidth = 2; this.ctx.stroke();

            // Checkbox for SATA
            if (isSATA) {
                this.ctx.strokeStyle = isSelected ? '#6366f1' : '#475569';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath(); this.ctx.roundRect(margin + 12, oY + 14, 24, 24, 4); this.ctx.stroke();
                if (isSelected) {
                    this.ctx.fillStyle = '#6366f1'; this.ctx.fill();
                    this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 18px Arial';
                    this.ctx.fillText('✓', margin + 24, oY + 32);
                }
            }

            // Option text
            this.ctx.fillStyle = '#fff'; this.ctx.font = '16px Arial'; this.ctx.textAlign = 'left';
            const textX = isSATA ? margin + 48 : margin + 20;
            let text = opt;
            const maxT = this.width - margin * 2 - (isSATA ? 70 : 40);
            while (this.ctx.measureText(text).width > maxT && text.length > 15) text = text.slice(0, -4) + '...';
            this.ctx.fillText(text, textX, oY + 33);
        });

        // SATA Submit Button (only if not yet answered)
        if (isSATA && !this.questionResult) {
            const btnY = startY + this.currentQuestion.options.length * (optH + gap) + 10;
            const btnW = 200, btnH = 50;
            const canSubmit = this.selectedAnswers.length > 0;

            this.ctx.fillStyle = canSubmit ? '#6366f1' : '#374151';
            this.ctx.beginPath(); this.ctx.roundRect(this.centerX - btnW / 2, btnY, btnW, btnH, 25); this.ctx.fill();

            this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 18px Arial'; this.ctx.textAlign = 'center';
            this.ctx.fillText('SUBMIT ANSWER', this.centerX, btnY + 32);

            // Store button coords for click handling
            this.sataSubmitBtn = { x: this.centerX - btnW / 2, y: btnY, w: btnW, h: btnH };
        }

        // Result feedback + Rationale
        if (this.questionResult) {
            this.ctx.textAlign = 'center';

            // Result text
            this.ctx.font = 'bold 32px Arial';
            const resultY = this.height - 100;
            if (this.questionResult === 'correct') {
                const reward = isSATA ? 35 * this.multiplier : 25 * this.multiplier;
                this.ctx.fillStyle = '#22c55e';
                this.ctx.fillText(`✓ CORRECT! +${reward} coins`, this.centerX, resultY);
            } else if (this.questionResult === 'timeout') {
                this.ctx.fillStyle = '#ef4444';
                this.ctx.fillText('⏱️ TIME UP!', this.centerX, resultY);
            } else {
                this.ctx.fillStyle = '#ef4444';
                this.ctx.fillText('✗ INCORRECT', this.centerX, resultY);
            }

            // Rationale
            if (this.currentQuestion.explanation) {
                this.ctx.fillStyle = '#94a3b8'; this.ctx.font = '15px Arial';
                const lines = this.wrapText(this.currentQuestion.explanation, this.width * 0.8);
                lines.forEach((ln, i) => this.ctx.fillText(ln, this.centerX, resultY + 35 + i * 20));
            }
        }
    }

    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        words.forEach(word => {
            const test = currentLine + word + ' ';
            if (this.ctx.measureText(test).width > maxWidth && currentLine) {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else currentLine = test;
        });
        if (currentLine) lines.push(currentLine.trim());
        return lines;
    }

    drawGameOver() {
        // Darkened blur overlay
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Header - Large "GAME OVER"
        this.ctx.shadowColor = '#ef4444'; this.ctx.shadowBlur = 40;
        this.ctx.fillStyle = '#ef4444';
        this.ctx.font = '800 60px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.centerX, this.height * 0.15);
        this.ctx.shadowBlur = 0;

        // Glass Card Container for Stats
        const cardW = Math.min(600, this.width * 0.9);
        const cardH = this.height * 0.5;
        const cardX = this.centerX - cardW / 2;
        const cardY = this.height * 0.22;

        this.ctx.fillStyle = 'rgba(30, 41, 59, 0.6)'; // Glass bg
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath(); this.ctx.roundRect(cardX, cardY, cardW, cardH, 20); this.ctx.fill(); this.ctx.stroke();

        // Score Section
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
        this.ctx.fillText('FINAL SCORE', this.centerX, cardY + 50);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '700 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
        this.ctx.fillText(this.score.toLocaleString(), this.centerX, cardY + 95);

        // High Score / New Best
        if (this.score >= this.highScore) {
            this.ctx.fillStyle = '#fbbf24'; this.ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
            this.ctx.fillText('🏆 NEW HIGH SCORE! 🏆', this.centerX, cardY + 130);
        } else {
            this.ctx.fillStyle = '#64748b'; this.ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
            this.ctx.fillText(`Personal Best: ${this.highScore.toLocaleString()}`, this.centerX, cardY + 130);
        }

        // Stats Row (XP, Coins, Questions)
        const statsY = cardY + 180;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.beginPath(); this.ctx.roundRect(cardX + 20, statsY, cardW - 40, 80, 12); this.ctx.fill();

        this.ctx.fillStyle = '#fbbf24'; this.ctx.font = '600 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`💰 ${this.coins}`, cardX + 50, statsY + 48);

        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#22c55e';
        this.ctx.fillText(`+${Math.floor(this.score / 10)} XP`, cardX + cardW - 50, statsY + 48);

        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#a855f7'; this.ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
        this.ctx.fillText(`${this.questionsCorrectRun}/${this.questionsAnswered} Correct`, this.centerX, statsY + 48);

        // Retry Button
        const btnY = this.height * 0.82;
        const btnW = 240;
        const btnH = 56;

        this.ctx.shadowColor = '#6366f1'; this.ctx.shadowBlur = 25;
        this.ctx.fillStyle = '#6366f1';
        this.ctx.beginPath(); this.ctx.roundRect(this.centerX - btnW / 2, btnY, btnW, btnH, 28); this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = '#fff'; this.ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
        this.ctx.fillText('TRY AGAIN', this.centerX, btnY + 34);

        this.ctx.fillStyle = '#64748b'; this.ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial';
        this.ctx.fillText('Press SPACE to Restart', this.centerX, btnY + 85);
    }

    loop(ts) { const dt = Math.min(ts - this.lastTime, 50); this.lastTime = ts; this.update(dt); this.render(); if (this.running) requestAnimationFrame(t => this.loop(t)); }
    start() { if (!this.running) { this.running = true; this.lastTime = performance.now(); requestAnimationFrame(t => this.loop(t)); } }
    stop() { this.running = false; if (this._kh) document.removeEventListener('keydown', this._kh); }
}

let mskRunner = null;
function initGame() { const c = document.getElementById('gameCanvas'); if (!c) return; if (mskRunner) mskRunner.stop(); mskRunner = new MSKReviewRunner(c); mskRunner.start(); }
function stopGame() { if (mskRunner) { mskRunner.stop(); mskRunner = null; } }
window.addEventListener('resize', () => { if (mskRunner) mskRunner.resize(); });
