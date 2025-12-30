// Musculoskeletal Mastery - Interactive Study Guide
// ENHANCED VERSION with Answer Shuffling
// ================================================

// Flashcard Data - 50 cards
const flashcards = [
  { q: "What are the 6 P's of neurovascular assessment?", a: "Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia" },
  { q: "What is the most common type of joint in the body?", a: "Synovial joints - freely movable joints with synovial fluid" },
  { q: "What connects muscle to bone?", a: "Tendons (remember: Tendons = To bone)" },
  { q: "What connects bone to bone?", a: "Ligaments" },
  { q: "What is compartment syndrome?", a: "Increased pressure within a muscle compartment that cuts off blood flow - a surgical emergency requiring fasciotomy" },
  { q: "What is the DXA scan used for?", a: "Dual-energy X-ray absorptiometry - diagnoses osteoporosis by measuring bone density" },
  { q: "What is the difference between open and closed fractures?", a: "Open: bone breaks through skin (high infection risk). Closed: skin remains intact" },
  { q: "Name 4 medications used for osteoporosis.", a: "Calcitonin, Estrogen, Calcium supplements, Vitamin D, Bisphosphonates" },
  { q: "What is synovitis?", a: "Inflammation of the synovial membrane lining joints - causes pain, swelling, and potential cartilage damage" },
  { q: "What causes osteoarthritis (OA)?", a: "'Wear and tear' - cartilage breakdown from use, injury, and age" },
  { q: "What causes rheumatoid arthritis (RA)?", a: "Autoimmune disease - the body attacks its own joints" },
  { q: "How does OA pain differ from RA pain?", a: "OA: worse with activity, better with rest. RA: morning stiffness that improves with movement" },
  { q: "Which joints does OA typically affect?", a: "Weight-bearing joints: knees, hips, spine, fingers (often asymmetrical)" },
  { q: "Which joints does RA typically affect?", a: "Symmetrical: both hands, wrists, feet affected equally" },
  { q: "What are the 3 types of hip fractures?", a: "Femoral head, Intertrochanteric, Subtrochanteric" },
  { q: "What is the most common cause of hip fractures?", a: "Falls (especially in elderly patients)" },
  { q: "What is poikilothermia?", a: "Coolness/cold temperature of the extremity - one of the 6 P's indicating poor circulation" },
  { q: "What is paresthesia?", a: "Numbness and tingling sensations - one of the 6 P's" },
  { q: "What treatment is performed for compartment syndrome?", a: "Fasciotomy - surgical procedure to relieve pressure by cutting open the fascia" },
  { q: "What is the priority nursing action for suspected compartment syndrome?", a: "Notify surgeon IMMEDIATELY, loosen/bivalve cast, keep limb at heart level" },
  { q: "What are complications of immobility affecting the cardiovascular system?", a: "Orthostatic hypotension, DVT, venous thromboembolism, increased cardiac workload" },
  { q: "What are complications of immobility affecting the respiratory system?", a: "Atelectasis, pneumonia, decreased lung expansion, secretion pooling" },
  { q: "What are complications of immobility affecting the integumentary system?", a: "Pressure ulcers, skin breakdown, decreased tissue perfusion" },
  { q: "What are complications of immobility affecting the GI system?", a: "Constipation, decreased peristalsis, appetite changes" },
  { q: "What psychosocial changes occur with immobility?", a: "Depression, decreased cognition, sensory deprivation, altered sleep" },
  { q: "What are the 4 types of bones?", a: "Short (carpals), Flat (skull, ribs), Irregular (vertebrae), Long (femur)" },
  { q: "What is the growth plate called?", a: "Epiphyseal plate - responsible for longitudinal bone growth" },
  { q: "What is arthroplasty?", a: "Surgical repair/replacement of damaged joints with artificial prosthesis" },
  { q: "How many days before arthroplasty should NSAIDs be stopped?", a: "7 days (at least one week before surgery)" },
  { q: "What special soap is used before joint replacement surgery?", a: "Hibiclens (chlorhexidine) - antibacterial to reduce skin bacteria" },
  { q: "What are post-op concerns after arthroplasty?", a: "Infection, displacement, pain, neurovascular compromise, DVT, anemia" },
  { q: "What causes amputation?", a: "Traumatic injury, PVD, diabetes, atherosclerosis, infection/gangrene, smoking" },
  { q: "What is the goal of amputation surgery?", a: "Preserve as much tissue as possible while removing infected or necrotic areas" },
  { q: "What clinical signs indicate need for amputation?", a: "Absent perfusion, pale/necrotic limb, absent pulse, non-blanching, foul odor" },
  { q: "What diagnostics are used before amputation?", a: "Doppler studies, invasive angiogram, ankle-brachial index (ABI)" },
  { q: "What rehabilitation is needed after amputation?", a: "Prosthesis fitting, ROM/PT, phantom limb pain management, psychological support" },
  { q: "What is skeletal traction?", a: "Traction using pins/wires inserted directly into bone" },
  { q: "What is skin traction?", a: "Traction using tape, straps, or foam applied to skin surface" },
  { q: "Why is smoking cessation important before surgery?", a: "Crucial for healing - smoking impairs blood flow and tissue repair" },
  { q: "What aging changes affect the musculoskeletal system?", a: "Decreased bone density, thinning cartilage, stiff joints, decreased muscle mass (sarcopenia)" },
  { q: "What is the LPN's role in initial musculoskeletal assessment?", a: "Observe for tenderness, swelling, redness, deformity; note movement; neurovascular checks; pain history" },
  { q: "What lab values should be assessed for osteoporosis?", a: "Calcium, magnesium, PTH (parathyroid hormone) levels" },
  { q: "Why is osteoporosis called 'the silent disease'?", a: "Often no symptoms until a fracture occurs - bone loss happens silently" },
  { q: "What diagnostic studies are used for back pain?", a: "Stork test, Adam's test, X-ray, MRI, CT scan, EMG/nerve conduction studies" },
  { q: "What non-pharmacological treatments help arthritis?", a: "Rest, exercise, weight loss, heat/cold therapy, physical therapy" },
  { q: "What medications treat RA?", a: "DMARDs (disease-modifying antirheumatic drugs), immunosuppressants" },
  { q: "What vitamins/minerals are essential for bone health?", a: "Calcium and Vitamin D" },
  { q: "What is the RICE protocol?", a: "Rest, Ice, Compression, Elevation - for sprains and strains" },
  { q: "What is fat embolism syndrome a complication of?", a: "Long bone fractures - fat globules enter bloodstream" },
  { q: "What are signs of fat embolism?", a: "Respiratory distress, petechial rash, confusion (usually 24-72 hrs after fracture)" }
];

// Quiz Questions with SHUFFLED answers built-in - 80 NCLEX-Style Questions
const quizQuestionsBase = [
  // ===== CHAPTER 61: DIAGNOSTIC PROCEDURES (10 questions) =====
  {
    q: "A nurse is reinforcing preoperative teaching for a client scheduled for arthroscopy of the knee. Which statements should the nurse include? (Select all that apply)",
    category: "diagnostics",
    type: "sata",
    options: [
      "Apply ice packs to the area for the first 24 hours",
      "Keep the leg in a dependent position after surgery",
      "Perform isometric exercises as prescribed",
      "Avoid placing a cast on the surgical site",
      "Monitor the incision for signs of infection"
    ],
    correctAnswers: ["Apply ice packs to the area for the first 24 hours", "Perform isometric exercises as prescribed", "Monitor the incision for signs of infection"],
    explanation: "Post-arthroscopy care includes ice for 24 hours to reduce swelling, isometric exercises to maintain strength, and monitoring for infection. The leg should be elevated, not dependent."
  },
  {
    q: "A nurse is preparing a client for a bone scan. Which instruction should the nurse provide?",
    category: "diagnostics",
    options: [
      "You will receive the radioactive injection when scanning begins",
      "You must remain NPO for 24 hours before the test",
      "You should empty your bladder before the procedure",
      "Radioactive precautions are needed for 72 hours after"
    ],
    correctAnswer: "You should empty your bladder before the procedure",
    explanation: "Emptying the bladder before a bone scan promotes visualization of the pelvic bones. The radioactive isotope is injected 2-3 hours BEFORE scanning, and precautions are not needed after the procedure."
  },
  {
    q: "A client asks about DEXA scan results showing a T-score of -2.8. The nurse explains this indicates:",
    category: "diagnostics",
    options: [
      "Normal bone density",
      "Osteopenia",
      "Osteoporosis",
      "Severe osteomalacia"
    ],
    correctAnswer: "Osteoporosis",
    explanation: "A T-score of -2.5 or lower indicates osteoporosis. Osteopenia is -1.0 to -2.5. Normal is above -1.0."
  },
  {
    q: "Which client would the nurse identify as having a contraindication for electromyography (EMG)?",
    category: "diagnostics",
    options: [
      "A client taking metformin for diabetes",
      "A client taking warfarin for atrial fibrillation",
      "A client with a history of seasonal allergies",
      "A client who drinks 2 cups of coffee daily"
    ],
    correctAnswer: "A client taking warfarin for atrial fibrillation",
    explanation: "Anticoagulant therapy is a contraindication for EMG due to the risk of bleeding within the muscle from needle insertion."
  },
  {
    q: "A nurse is reinforcing teaching about DEXA scans at a health fair. Which information should the nurse include? (Select all that apply)",
    category: "diagnostics",
    type: "sata",
    options: [
      "The test requires contrast material injection",
      "The hip and spine are the usual areas scanned",
      "The scan detects osteoarthritis",
      "Bone pain can indicate a need for a scan",
      "Females should have a baseline scan during ages 40-49 years"
    ],
    correctAnswers: ["The hip and spine are the usual areas scanned", "Bone pain can indicate a need for a scan", "Females should have a baseline scan during ages 40-49 years"],
    explanation: "DEXA scans do not use contrast and detect bone density (osteoporosis), not osteoarthritis. Baseline testing for females is recommended ages 40-49."
  },
  {
    q: "A client is scheduled for EMG testing. Which pre-procedure instruction should the nurse provide?",
    category: "diagnostics",
    options: [
      "Fast for 12 hours before the test",
      "Avoid smoking and caffeine for at least 3 hours before the test",
      "Take your muscle relaxant as prescribed the morning of the test",
      "Expect to receive sedation medication before the procedure"
    ],
    correctAnswer: "Avoid smoking and caffeine for at least 3 hours before the test",
    explanation: "Clients should avoid stimulants before EMG. Fasting is not required, muscle relaxants are typically stopped, and sedation is avoided because the client must follow commands."
  },
  {
    q: "A nurse is caring for a client post-arthroscopy. Which nursing action is appropriate?",
    category: "diagnostics",
    options: [
      "Apply warm compresses to the incision sites",
      "Monitor neurovascular status every hour",
      "Encourage the client to begin weight-bearing exercises immediately",
      "Keep the extremity in a dependent position"
    ],
    correctAnswer: "Monitor neurovascular status every hour",
    explanation: "Neurovascular monitoring is essential after arthroscopy. Cold therapy (not heat) is used for 24 hours, and the extremity should be elevated."
  },
  {
    q: "Following a gallium scan, which instruction should the nurse reinforce?",
    category: "diagnostics",
    options: [
      "Avoid contact with pregnant women for 24 hours",
      "Increase fluid intake to promote excretion of the radioisotope",
      "Monitor urine for visible changes in color",
      "Remain on bed rest for 4 hours"
    ],
    correctAnswer: "Increase fluid intake to promote excretion of the radioisotope",
    explanation: "Increased fluid intake helps excrete the radioisotope through urine and feces. No special precautions or isolation are needed after the procedure."
  },
  {
    q: "A client scheduled for MRI reports having a pacemaker. What is the nurse's priority action?",
    category: "diagnostics",
    options: [
      "Explain that the procedure will take longer than usual",
      "Notify the provider as this is a contraindication for MRI",
      "Administer prescribed sedation before the procedure",
      "Ensure the client removes all jewelry"
    ],
    correctAnswer: "Notify the provider as this is a contraindication for MRI",
    explanation: "Metal implants, including pacemakers, are contraindications for MRI due to the strong magnetic field. The provider must be notified."
  },
  {
    q: "Which finding in a client with a suspected bone fracture would indicate a need for a CT scan rather than an x-ray?",
    category: "diagnostics",
    options: [
      "Simple wrist fracture",
      "Possible hip or pelvic fracture",
      "Mild ankle sprain",
      "Closed finger fracture"
    ],
    correctAnswer: "Possible hip or pelvic fracture",
    explanation: "CT scans provide better visualization of complex structures like the hip and pelvis. Simple fractures are typically evaluated with standard x-rays."
  },

  // ===== CHAPTER 62: ARTHROPLASTY (12 questions) =====
  {
    q: "A nurse is collecting data from a client scheduled for knee arthroplasty. Which findings should the nurse expect? (Select all that apply)",
    category: "arthroplasty",
    type: "sata",
    options: [
      "Pain when bearing weight",
      "Joint crepitus",
      "Skin reddened over the joint",
      "Swelling of the affected joint",
      "Limited joint motion"
    ],
    correctAnswers: ["Pain when bearing weight", "Joint crepitus", "Swelling of the affected joint", "Limited joint motion"],
    explanation: "Clients needing arthroplasty typically have pain with weight-bearing, crepitus, swelling (in knees), and limited motion. Reddened skin suggests infection, not typical OA."
  },
  {
    q: "Which finding in a client's history should the nurse recognize as a contraindication for total joint arthroplasty?",
    category: "arthroplasty",
    options: [
      "Age 55 years",
      "History of cancer 5 years ago",
      "Previous joint replacement on opposite side",
      "Bronchitis 2 weeks ago"
    ],
    correctAnswer: "Bronchitis 2 weeks ago",
    explanation: "Recent or active infection is a contraindication for arthroplasty because organisms can migrate to the surgical site and cause prosthesis failure."
  },
  {
    q: "A nurse is caring for a client following a total knee replacement. Which actions should the nurse take? (Select all that apply)",
    category: "arthroplasty",
    type: "sata",
    options: [
      "Check continuous passive motion (CPM) device settings",
      "Palpate dorsal pedal pulses",
      "Place a pillow behind the knee",
      "Request a referral for outpatient physical therapy",
      "Apply heat therapy to the incision"
    ],
    correctAnswers: ["Check continuous passive motion (CPM) device settings", "Palpate dorsal pedal pulses", "Request a referral for outpatient physical therapy"],
    explanation: "After TKR: check CPM settings, monitor pulses (neurovascular status), and plan for PT. Avoid pillows behind the knee (causes flexion contracture) and use ice (not heat) for swelling."
  },
  {
    q: "Which position prevents hip dislocation after total hip arthroplasty?",
    category: "arthroplasty",
    options: [
      "Legs adducted past midline",
      "Legs abducted with wedge pillow between them",
      "Hip flexion greater than 90 degrees",
      "Legs crossed at the ankles"
    ],
    correctAnswer: "Legs abducted with wedge pillow between them",
    explanation: "After hip replacement, maintain abduction with a wedge pillow. Avoid adduction past midline, hip flexion >90°, and crossing legs to prevent dislocation."
  },
  {
    q: "A nurse is providing postoperative care for a client who has a total hip arthroplasty. Which actions should the nurse take? (Select all that apply)",
    category: "arthroplasty",
    type: "sata",
    options: [
      "Provide a raised toilet seat for the client",
      "Place client in a low reclining chair",
      "Instruct the client to roll onto the operative hip",
      "Use an abductor pillow when turning the client",
      "Instruct the client on the use of an incentive spirometer"
    ],
    correctAnswers: ["Provide a raised toilet seat for the client", "Use an abductor pillow when turning the client", "Instruct the client on the use of an incentive spirometer"],
    explanation: "After THA: use raised toilet seat (prevents >90° flexion), abductor pillow, and incentive spirometer. Avoid low chairs and rolling onto operative side."
  },
  {
    q: "A client 2 days post-hip replacement reports sudden severe hip pain and states they heard a 'pop.' The nurse observes the affected leg is shortened and internally rotated. What should the nurse suspect?",
    category: "arthroplasty",
    options: [
      "Deep vein thrombosis",
      "Hip dislocation",
      "Fat embolism",
      "Incisional infection"
    ],
    correctAnswer: "Hip dislocation",
    explanation: "Classic signs of hip dislocation: acute pain, hearing a 'pop,' affected extremity shortened, and internal or external rotation. This is an emergency."
  },
  {
    q: "Which instruction should the nurse reinforce for a client being discharged after total hip arthroplasty? (Select all that apply)",
    category: "arthroplasty",
    type: "sata",
    options: [
      "Perform calf and leg exercises every 2 hours",
      "Turn toes inward when sitting or lying",
      "Bend at the waist when putting on socks",
      "Use a raised toilet seat",
      "Use a long-handled shoehorn"
    ],
    correctAnswers: ["Perform calf and leg exercises every 2 hours", "Use a raised toilet seat", "Use a long-handled shoehorn"],
    explanation: "After THA: do leg exercises (DVT prevention), use raised toilet seat and assistive devices. Avoid internal rotation (turning toes inward) and bending >90° at waist."
  },
  {
    q: "DVT prophylaxis after total knee replacement includes which interventions?",
    category: "arthroplasty",
    options: [
      "Strict bed rest for the first week",
      "Anticoagulants, compression devices, and early ambulation",
      "Aspirin therapy alone",
      "Keeping the leg in a dependent position"
    ],
    correctAnswer: "Anticoagulants, compression devices, and early ambulation",
    explanation: "DVT prevention requires a combination: anticoagulants (enoxaparin, warfarin), sequential compression devices, and early mobilization."
  },
  {
    q: "A client asks why they must use Hibiclens soap before joint replacement surgery. The nurse explains:",
    category: "arthroplasty",
    options: [
      "'It helps you relax before surgery'",
      "'It reduces skin bacteria to prevent infection'",
      "'It removes dead skin cells for better wound healing'",
      "'It decreases pain sensitivity at the surgical site'"
    ],
    correctAnswer: "'It reduces skin bacteria to prevent infection'",
    explanation: "Antiseptic soap (chlorhexidine/Hibiclens) used before surgery decreases bacterial count on the skin, lowering infection risk."
  },
  {
    q: "Which client statement indicates understanding of discharge teaching after total knee arthroplasty?",
    category: "arthroplasty",
    options: [
      "'I can kneel to garden once I get home'",
      "'I should avoid deep-knee bends indefinitely'",
      "'I can stop taking anticoagulants after one week'",
      "'I don't need to worry about infection since the surgery is done'"
    ],
    correctAnswer: "'I should avoid deep-knee bends indefinitely'",
    explanation: "After TKR, kneeling and deep-knee bends are limited indefinitely to protect the prosthesis. Anticoagulants continue for several weeks, and infection risk continues."
  },
  {
    q: "Which is the priority assessment for a client immediately after total joint arthroplasty?",
    category: "arthroplasty",
    options: [
      "Pain level using a 0-10 scale",
      "Neurovascular status of the operative extremity",
      "Ability to move the joint independently",
      "Client's understanding of hip precautions"
    ],
    correctAnswer: "Neurovascular status of the operative extremity",
    explanation: "Neurovascular assessment (movement, sensation, color, pulse, capillary refill) is the priority to detect compromised circulation early."
  },
  {
    q: "A nurse notes bloody drainage on the hip dressing of a postoperative arthroplasty client. The Hemoglobin is 8.5 g/dL (decreased from 11.2 g/dL preoperatively). What should the nurse anticipate?",
    category: "arthroplasty",
    options: [
      "Immediate surgical exploration",
      "Administration of antifibrinolytic medication",
      "Autologous blood transfusion",
      "Increasing the IV fluid rate only"
    ],
    correctAnswer: "Autologous blood transfusion",
    explanation: "Clients may donate their own blood before surgery for postoperative transfusion if needed. A drop in Hgb/Hct indicates blood loss requiring replacement."
  },

  // ===== CHAPTER 63: AMPUTATIONS (10 questions) =====
  {
    q: "At the scene of a traumatic amputation, which action should the nurse take first?",
    category: "amputations",
    options: [
      "Locate and preserve the severed extremity",
      "Apply direct pressure to control hemorrhage",
      "Call for emergency medical services",
      "Wrap the severed part in ice"
    ],
    correctAnswer: "Apply direct pressure to control hemorrhage",
    explanation: "The priority is preventing life-threatening hemorrhage with direct pressure. Then activate EMS and preserve the severed part (in dry gauze, sealed bag, in ice water)."
  },
  {
    q: "A client with a below-knee amputation reports burning and tingling pain in the 'missing' foot. The nurse recognizes this as:",
    category: "amputations",
    options: [
      "Incisional pain requiring opioid medication",
      "Phantom limb pain that can be treated",
      "Signs of wound infection",
      "Psychological disturbance requiring psychiatric referral"
    ],
    correctAnswer: "Phantom limb pain that can be treated",
    explanation: "Phantom limb pain is real pain caused by severed nerve pathways. It should be acknowledged and treated with medications (gabapentin, pregabalin) or other therapies."
  },
  {
    q: "Which intervention helps prevent hip flexion contractures after an above-knee amputation?",
    category: "amputations",
    options: [
      "Place pillows under the residual limb at all times",
      "Keep the client in a seated position most of the day",
      "Have the client lie prone for 20-30 minutes several times daily",
      "Elevate the residual limb on pillows indefinitely"
    ],
    correctAnswer: "Have the client lie prone for 20-30 minutes several times daily",
    explanation: "Lying prone helps prevent hip flexion contractures. Prolonged sitting and pillows under the stump encourage contractures."
  },
  {
    q: "A nurse is reinforcing teaching about residual limb wrapping. Which technique is correct?",
    category: "amputations",
    options: [
      "Circular wrapping from proximal to distal",
      "Figure-eight wrapping to prevent blood flow restriction",
      "Tight bandaging to speed shrinkage",
      "Apply wrap once daily for shaping"
    ],
    correctAnswer: "Figure-eight wrapping to prevent blood flow restriction",
    explanation: "Figure-eight wrapping prevents restriction of blood flow while shaping and shrinking the residual limb. Wrapping should be done 2-3 times daily."
  },
  {
    q: "Which nursing actions are appropriate for a client who had an amputation? (Select all that apply)",
    category: "amputations",
    type: "sata",
    options: [
      "Administer gabapentin for phantom limb pain",
      "Delay range-of-motion exercises for 48 hours after surgery",
      "Record amount, color, and odor of wound drainage",
      "Reinforce teaching to avoid the prone position",
      "Compare pulses in the affected extremity with the other extremity"
    ],
    correctAnswers: ["Administer gabapentin for phantom limb pain", "Record amount, color, and odor of wound drainage", "Compare pulses in the affected extremity with the other extremity"],
    explanation: "Gabapentin helps phantom pain. ROM exercises begin immediately. Prone positioning PREVENTS contractures (not avoided). Monitor wound drainage and compare pulses."
  },
  {
    q: "A client who has a new amputation appears withdrawn and refuses to look at the residual limb. Which nursing response is most therapeutic?",
    category: "amputations",
    options: [
      "'You need to look at your leg to learn proper care'",
      "'I understand this is difficult. Would you like to talk about your feelings?'",
      "'Many people feel this way. You'll get used to it soon'",
      "'Should I cover your leg so you don't have to see it?'"
    ],
    correctAnswer: "'I understand this is difficult. Would you like to talk about your feelings?'",
    explanation: "Acknowledging feelings and offering to listen is therapeutic. Grief over body image changes is normal and should be supported."
  },
  {
    q: "Which member of the interprofessional team fits the client with a prosthesis?",
    category: "amputations",
    options: [
      "Physical therapist",
      "Occupational therapist",
      "Certified prosthetic orthotist",
      "Wound care nurse"
    ],
    correctAnswer: "Certified prosthetic orthotist",
    explanation: "A certified prosthetic orthotist fits the prosthesis after the wound is healed and the residual limb has shrunk. Physical therapists then train in its use."
  },
  {
    q: "When caring for a client's severed extremity at an accident scene, the nurse should:",
    category: "amputations",
    options: [
      "Place the part directly on ice",
      "Wrap in dry sterile gauze, place in sealed bag, then in ice water",
      "Submerge the part in saline solution",
      "Keep the part warm to maintain tissue viability"
    ],
    correctAnswer: "Wrap in dry sterile gauze, place in sealed bag, then in ice water",
    explanation: "The severed part should be wrapped in dry sterile gauze, placed in a sealed bag, then in ice water (1:3 ice to water ratio). Never place directly on ice."
  },
  {
    q: "Which finding in a client 3 days post-amputation requires immediate notification of the provider?",
    category: "amputations",
    options: [
      "Phantom sensation in the missing limb",
      "Temperature 101.2°F (38.4°C) with purulent drainage from the incision",
      "Mild incisional discomfort rated 3/10",
      "Feelings of sadness about the loss"
    ],
    correctAnswer: "Temperature 101.2°F (38.4°C) with purulent drainage from the incision",
    explanation: "Fever with purulent drainage indicates infection, which can lead to osteomyelitis. This requires immediate reporting."
  },
  {
    q: "Which type of pain management is commonly used for phantom limb pain? (Select all that apply)",
    category: "amputations",
    type: "sata",
    options: [
      "Gabapentin (Neurontin)",
      "TENS (transcutaneous electrical nerve stimulation)",
      "Increased opioid dosing as first-line treatment",
      "Mirror therapy",
      "Massage of the residual limb"
    ],
    correctAnswers: ["Gabapentin (Neurontin)", "TENS (transcutaneous electrical nerve stimulation)", "Mirror therapy", "Massage of the residual limb"],
    explanation: "Phantom limb pain is treated with anticonvulsants (gabapentin), TENS, mirror therapy, and massage. Opioids are not first-line for this type of pain."
  },

  // ===== CHAPTER 64: OSTEOPOROSIS (12 questions) =====
  {
    q: "Which clients have risk factors for osteoporosis? (Select all that apply)",
    category: "osteoporosis",
    type: "sata",
    options: [
      "A 40-year-old client who has taken prednisone for 1 month",
      "A 30-year-old client who jogs daily",
      "A 45-year-old client who has taken phenytoin for 20 years",
      "A 65-year-old client who has taken furosemide for 15 years",
      "A 50-year-old client who has smoked tobacco for 5 years"
    ],
    correctAnswers: ["A 45-year-old client who has taken phenytoin for 20 years", "A 65-year-old client who has taken furosemide for 15 years", "A 50-year-old client who has smoked tobacco for 5 years"],
    explanation: "Long-term use of corticosteroids, anticonvulsants, and loop diuretics affects calcium/bone metabolism. Smoking and age are also risk factors. One month of prednisone and exercise are not risk factors."
  },
  {
    q: "A nurse is reinforcing dietary teaching about calcium-rich foods with a client who has osteoporosis. Which food should the nurse include?",
    category: "osteoporosis",
    options: [
      "White bread",
      "Broccoli",
      "Apples",
      "Brown rice"
    ],
    correctAnswer: "Broccoli",
    explanation: "Broccoli and other green leafy vegetables are calcium-rich. Other sources include dairy products, fortified orange juice, and red/white beans."
  },
  {
    q: "Which client findings indicate risk factors for osteoporosis? (Select all that apply)",
    category: "osteoporosis",
    type: "sata",
    options: [
      "History of consuming 3 alcoholic beverages daily",
      "Loss of height of 2 inches (5.1 cm)",
      "Body mass index (BMI) of 28",
      "History of hyperthyroidism",
      "Age less than 45 years"
    ],
    correctAnswers: ["History of consuming 3 alcoholic beverages daily", "Loss of height of 2 inches (5.1 cm)", "History of hyperthyroidism"],
    explanation: "Risk factors: alcohol (3+ drinks/day), height loss (vertebral fractures), hyperthyroidism. High BMI is actually protective, and age >50 is a risk factor."
  },
  {
    q: "A nurse is planning discharge teaching on home safety for a client with osteoporosis. Which information should the nurse include? (Select all that apply)",
    category: "osteoporosis",
    type: "sata",
    options: [
      "Remove throw rugs in walkways",
      "Use prescribed assistive devices",
      "Remove clutter from the environment",
      "Wear soft-bottomed shoes",
      "Maintain lighting of doorway areas"
    ],
    correctAnswers: ["Remove throw rugs in walkways", "Use prescribed assistive devices", "Remove clutter from the environment", "Maintain lighting of doorway areas"],
    explanation: "Fall prevention is critical. Remove hazards, use assistive devices, and ensure adequate lighting. Rubber-bottomed (not soft) shoes provide better traction."
  },
  {
    q: "A client taking alendronate (Fosamax) for osteoporosis should be instructed to:",
    category: "osteoporosis",
    options: [
      "Take the medication with food to prevent GI upset",
      "Take with 8 oz water and remain upright for 30 minutes",
      "Take at bedtime for maximum absorption",
      "Crush the tablet if difficulty swallowing"
    ],
    correctAnswer: "Take with 8 oz water and remain upright for 30 minutes",
    explanation: "Bisphosphonates must be taken with full glass of water, on empty stomach, and remain upright 30 min to prevent esophageal ulceration."
  },
  {
    q: "What type of exercise is recommended for clients with osteoporosis?",
    category: "osteoporosis",
    options: [
      "Swimming only (non-weight-bearing)",
      "Weight-bearing exercises like walking",
      "Bed rest to prevent fractures",
      "High-impact aerobics"
    ],
    correctAnswer: "Weight-bearing exercises like walking",
    explanation: "Weight-bearing exercises (walking, lifting weights, climbing stairs) promote bone rebuilding. Swimming is good exercise but not weight-bearing."
  },
  {
    q: "A nurse is administering raloxifene to a client with osteoporosis. Which assessment finding should the nurse report immediately?",
    category: "osteoporosis",
    options: [
      "Hot flashes",
      "Calf pain and tenderness",
      "Mild joint discomfort",
      "Insomnia"
    ],
    correctAnswer: "Calf pain and tenderness",
    explanation: "Raloxifene (SERM) increases DVT risk. Calf pain and tenderness can indicate DVT and requires immediate reporting."
  },
  {
    q: "A client receiving bisphosphonate therapy should have which dental consideration addressed?",
    category: "osteoporosis",
    options: [
      "Dental cleanings must be avoided while on therapy",
      "Dental examinations before starting therapy to prevent osteonecrosis of the jaw",
      "All teeth should be extracted before therapy",
      "No special dental considerations are needed"
    ],
    correctAnswer: "Dental examinations before starting therapy to prevent osteonecrosis of the jaw",
    explanation: "IV bisphosphonates increase risk of osteonecrosis of the jaw. Dental exams and preventative treatment before therapy minimize this risk."
  },
  {
    q: "A client undergoing vertebroplasty should be positioned how immediately after the procedure?",
    category: "osteoporosis",
    options: [
      "Prone for 4 hours",
      "Supine for 1-2 hours",
      "High-Fowler's position",
      "Left lateral recumbent"
    ],
    correctAnswer: "Supine for 1-2 hours",
    explanation: "After vertebroplasty, the client lies supine for 1-2 hours and may be discharged within 4 hours. Monitor for bleeding at puncture site."
  },
  {
    q: "Which medication administration instruction is correct for calcium supplements?",
    category: "osteoporosis",
    options: [
      "Take all calcium at once for better absorption",
      "Take with food in divided doses with water",
      "Take on an empty stomach for maximum absorption",
      "Avoid taking with vitamin D"
    ],
    correctAnswer: "Take with food in divided doses with water",
    explanation: "Calcium supplements should be taken with food in divided doses (body can only absorb limited amounts at once) with 6-8 oz water."
  },
  {
    q: "Which finding in a client taking teriparatide (Forteo) should the nurse report to the provider?",
    category: "osteoporosis",
    options: [
      "Previous radiation therapy to bones",
      "Mild muscle cramping",
      "Taking calcium supplements",
      "Postmenopausal status"
    ],
    correctAnswer: "Previous radiation therapy to bones",
    explanation: "Teriparatide is contraindicated in clients with history of radiation, bone cancer, or Paget's disease due to increased risk of osteosarcoma."
  },
  {
    q: "A client asks about calcitonin nasal spray for osteoporosis. The nurse explains:",
    category: "osteoporosis",
    options: [
      "'This medication increases bone formation'",
      "'This medication decreases bone resorption by inhibiting osteoclasts'",
      "'This medication replaces estrogen lost during menopause'",
      "'This medication is only used for hypocalcemia'"
    ],
    correctAnswer: "'This medication decreases bone resorption by inhibiting osteoclasts'",
    explanation: "Calcitonin inhibits osteoclast activity, decreasing bone resorption. It's used for osteoporosis, hypercalcemia, and Paget's disease."
  },

  // ===== CHAPTER 65: MUSCULOSKELETAL TRAUMA (20 questions) =====
  {
    q: "A nurse is collecting data on a client 2 hours after external fixation device placement. Which findings indicate compartment syndrome? (Select all that apply)",
    category: "trauma",
    type: "sata",
    options: [
      "Pain of 10/10 when the affected foot is passively moved",
      "Capillary refill of 2 seconds on toes",
      "Hard, swollen muscle on the affected leg",
      "Tingling sensation on the affected foot",
      "2+ pedal pulses on the affected foot"
    ],
    correctAnswers: ["Pain of 10/10 when the affected foot is passively moved", "Hard, swollen muscle on the affected leg", "Tingling sensation on the affected foot"],
    explanation: "Compartment syndrome: intense pain with passive movement, hard swollen muscles, paresthesia (tingling). Normal capillary refill and pulses don't rule it out - pulselessness is a LATE sign."
  },
  {
    q: "Which type of fracture occurs when the bone is fragmented into multiple pieces?",
    category: "trauma",
    options: [
      "Oblique fracture",
      "Comminuted fracture",
      "Greenstick fracture",
      "Spiral fracture"
    ],
    correctAnswer: "Comminuted fracture",
    explanation: "Comminuted = fragmented. Oblique = angled across bone. Greenstick = one side only (children). Spiral = twisting motion."
  },
  {
    q: "A client with a new cast reports severe, increasing pain not relieved by prescribed medication. The nurse's priority action is:",
    category: "trauma",
    options: [
      "Administer additional pain medication",
      "Notify the provider immediately",
      "Elevate the extremity higher",
      "Apply ice to the cast"
    ],
    correctAnswer: "Notify the provider immediately",
    explanation: "Unrelieved, increasing pain is a cardinal sign of compartment syndrome. The provider must be notified immediately - the cast may need to be bivalved."
  },
  {
    q: "Which statement indicates a client understands cast care teaching?",
    category: "trauma",
    options: [
      "'I can use a coat hanger to scratch inside the cast'",
      "'I should keep the cast dry'",
      "'The cast feeling tight means it's working correctly'",
      "'I can put powder inside the cast for itching'"
    ],
    correctAnswer: "'I should keep the cast dry'",
    explanation: "Casts must be kept dry. Never insert objects inside the cast. Tightness may indicate swelling. Use cool air from a hair dryer for itching."
  },
  {
    q: "A nurse is reinforcing teaching about traction. Which statement about skeletal traction is accurate?",
    category: "trauma",
    options: [
      "Light weights of 5-7 pounds are used",
      "Weights can be removed briefly for repositioning",
      "Pins are inserted into bone and can use 15-30 pound weights",
      "It's primarily used for muscle spasm relief"
    ],
    correctAnswer: "Pins are inserted into bone and can use 15-30 pound weights",
    explanation: "Skeletal traction uses pins in bone with heavier weights (15-30 lbs) for longer traction times. Skin traction uses lighter weights (7-10 lbs)."
  },
  {
    q: "When caring for a client in skeletal traction, the nurse should:",
    category: "trauma",
    options: [
      "Remove weights briefly while repositioning",
      "Keep weights hanging freely at all times",
      "Add weights if the client reports increased pain",
      "Rest weights on the bed when the client sleeps"
    ],
    correctAnswer: "Keep weights hanging freely at all times",
    explanation: "Weights must hang freely at all times - never resting on floor or bed. Never remove or add weights without a provider order."
  },
  {
    q: "Which manifestation is an EARLY sign of fat embolism?",
    category: "trauma",
    options: [
      "Petechial rash on chest and neck",
      "Dyspnea with decreased oxygen saturation",
      "Complete respiratory failure",
      "Cardiac arrest"
    ],
    correctAnswer: "Dyspnea with decreased oxygen saturation",
    explanation: "Early fat embolism signs: dyspnea, increased respiratory rate, decreased O2 sat, headache, confusion. Petechiae is a LATE, discriminating finding from PE."
  },
  {
    q: "A client has a casted femur fracture. Which finding is a manifestation of fat embolism?",
    category: "trauma",
    options: [
      "Pain at the fracture site",
      "Petechial rash on the chest with respiratory distress",
      "Swelling around the cast",
      "Cool, pale extremity"
    ],
    correctAnswer: "Petechial rash on the chest with respiratory distress",
    explanation: "Fat embolism: respiratory distress + petechial rash (unique finding) + confusion. Usually occurs 24-72 hours after long bone fracture."
  },
  {
    q: "Pin care for external fixation should include:",
    category: "trauma",
    options: [
      "Using the same cotton swab for all pins",
      "Using one cotton swab per pin with prescribed solution",
      "Removing any crusting around pins immediately",
      "Covering pins with petroleum-based ointment"
    ],
    correctAnswer: "Using one cotton swab per pin with prescribed solution",
    explanation: "Use one cotton swab per pin to prevent cross-contamination. Follow facility protocol (often chlorhexidine). Some crusting is normal; report excessive drainage."
  },
  {
    q: "A client with an external fixation device asks about discharge. Which statement by the client indicates understanding?",
    category: "trauma",
    options: [
      "'I will expect white-colored drainage around pin sites'",
      "'I will clean each pin with sterile water only'",
      "'I will tighten the pins if they become loose'",
      "'I will report any increased drainage or loosening of pins'"
    ],
    correctAnswer: "'I will report any increased drainage or loosening of pins'",
    explanation: "Report increased drainage, redness, loosening pins, or infection signs. Clear drainage is expected initially; white/purulent drainage indicates infection. Never tighten pins yourself."
  },
  {
    q: "Which complication should the nurse monitor for in a client with a fracture who develops osteomyelitis?",
    category: "trauma",
    options: [
      "Hypoglycemia",
      "Need for long-term antibiotic therapy (4-6 weeks)",
      "Immediate resolution with oral antibiotics",
      "Rapid weight gain"
    ],
    correctAnswer: "Need for long-term antibiotic therapy (4-6 weeks)",
    explanation: "Osteomyelitis requires prolonged IV and oral antibiotics (4-6 weeks minimum). Surgical debridement may be needed. Without treatment, amputation may result."
  },
  {
    q: "The 5 P's of neurovascular assessment include: (Select all that apply)",
    category: "trauma",
    type: "sata",
    options: [
      "Pain",
      "Pressure",
      "Paresthesia",
      "Pallor",
      "Pulselessness",
      "Paralysis"
    ],
    correctAnswers: ["Pain", "Paresthesia", "Pallor", "Pulselessness", "Paralysis"],
    explanation: "The 5 P's: Pain (especially with passive movement), Paresthesia (numbness/tingling), Pallor, Pulselessness (late sign), Paralysis (late sign)."
  },
  {
    q: "A client with a new hip fracture is placed in Buck's traction. The nurse understands this is used to:",
    category: "trauma",
    options: [
      "Provide permanent fracture stabilization",
      "Decrease muscle spasms and immobilize before surgery",
      "Replace the need for surgical repair",
      "Allow immediate weight-bearing"
    ],
    correctAnswer: "Decrease muscle spasms and immobilize before surgery",
    explanation: "Buck's traction is skin traction used temporarily to decrease muscle spasms and immobilize before surgery, not for permanent stabilization."
  },
  {
    q: "When handling a wet plaster cast, the nurse should:",
    category: "trauma",
    options: [
      "Use fingertips to support the cast",
      "Use the palms of the hands to prevent denting",
      "Place it on a hard surface immediately",
      "Cover it with plastic to speed drying"
    ],
    correctAnswer: "Use the palms of the hands to prevent denting",
    explanation: "Handle wet plaster casts with palms (not fingertips) to prevent denting. Support on soft surface, allow air circulation for drying (not plastic)."
  },
  {
    q: "A nurse is monitoring a client after cast application. Which finding requires immediate intervention?",
    category: "trauma",
    options: [
      "Mild itching under the cast",
      "Cast feels slightly warm as it dries",
      "Client reports numbness and tingling in fingers",
      "Small amount of swelling above the cast"
    ],
    correctAnswer: "Client reports numbness and tingling in fingers",
    explanation: "Numbness and tingling (paresthesia) indicates possible neurovascular compromise and requires immediate intervention. Warmth during drying and mild itching are normal."
  },
  {
    q: "What is the priority intervention for a client who develops sudden severe hip pain and dyspnea 36 hours after a femur fracture?",
    category: "trauma",
    options: [
      "Administer acetaminophen for pain",
      "Notify the provider immediately and prepare for oxygen therapy",
      "Encourage deep breathing and coughing",
      "Apply ice to the hip"
    ],
    correctAnswer: "Notify the provider immediately and prepare for oxygen therapy",
    explanation: "These are signs of fat embolism (occurs 12-72 hours after long bone fracture). This is an emergency requiring immediate notification, oxygen, and supportive care."
  },
  {
    q: "Prevention of DVT in a client with a leg fracture includes: (Select all that apply)",
    category: "trauma",
    type: "sata",
    options: [
      "Early ambulation when permitted",
      "Anti-embolism stockings",
      "Ankle and foot exercises",
      "Keeping the leg in a dependent position",
      "Prescribed anticoagulant medication"
    ],
    correctAnswers: ["Early ambulation when permitted", "Anti-embolism stockings", "Ankle and foot exercises", "Prescribed anticoagulant medication"],
    explanation: "DVT prevention: early ambulation, compression stockings/SCDs, exercises (ankle rotation, plantar/dorsiflexion), anticoagulants, and adequate hydration. Elevate (not dependent position)."
  },
  {
    q: "A client with a closed fracture is at risk for which complication if not properly immobilized?",
    category: "trauma",
    options: [
      "Conversion to open fracture",
      "Spontaneous healing without intervention",
      "Decreased pain",
      "Improved circulation"
    ],
    correctAnswer: "Conversion to open fracture",
    explanation: "Improper immobilization can cause bone fragments to move and break through skin, converting closed to open fracture and increasing infection risk."
  },
  {
    q: "Which dietary instruction should the nurse reinforce for a client with a healing fracture?",
    category: "trauma",
    options: [
      "Low-protein diet to reduce inflammation",
      "High-protein and calcium diet to promote healing",
      "Low-calcium diet to prevent hypercalcemia",
      "Fluid restriction to reduce swelling"
    ],
    correctAnswer: "High-protein and calcium diet to promote healing",
    explanation: "Fracture healing requires increased protein and calcium. Vitamin D supplements also help. If blood loss occurred, iron-rich foods are also important."
  },
  {
    q: "A client with carpal tunnel syndrome has a positive Phalen's test. This indicates:",
    category: "trauma",
    options: [
      "Numbness when tapping over the median nerve",
      "Paresthesia when wrists are flexed with backs of hands together",
      "Pain with finger extension",
      "Weakness in the thumb"
    ],
    correctAnswer: "Paresthesia when wrists are flexed with backs of hands together",
    explanation: "Phalen's test: flexing both wrists with backs of hands together causes paresthesia if positive. Tinel's sign is tapping over median nerve."
  },

  // ===== CHAPTER 66: OSTEOARTHRITIS & LOW-BACK PAIN (8 questions) =====
  {
    q: "A nurse is collecting data from a client with osteoarthritis. Which findings should the nurse expect? (Select all that apply)",
    category: "oa-lbp",
    type: "sata",
    options: [
      "Heberden's nodes",
      "Swelling of all joints symmetrically",
      "Small body frame",
      "Enlarged joint size",
      "Limp when walking"
    ],
    correctAnswers: ["Heberden's nodes", "Enlarged joint size", "Limp when walking"],
    explanation: "OA findings: Heberden's nodes (distal fingers), enlarged joints from bone hypertrophy, limping. OA is NOT typically symmetrical (that's RA) and clients are often overweight."
  },
  {
    q: "Which instruction should the nurse reinforce for a client with osteoarthritis?",
    category: "oa-lbp",
    options: [
      "Apply cold continuously to joints",
      "Rest joints as much as possible",
      "Apply heat to joints to alleviate pain and stiffness",
      "Exercise only when pain-free"
    ],
    correctAnswer: "Apply heat to joints to alleviate pain and stiffness",
    explanation: "Heat helps OA pain and stiffness. Balance rest with activity. On increased pain days, still attempt exercise but with fewer repetitions."
  },
  {
    q: "A nurse is reinforcing teaching about capsaicin cream for knee osteoarthritis. Which statement indicates understanding?",
    category: "oa-lbp",
    options: [
      "'I should remove the cream if I feel burning'",
      "'I should wear gloves when applying and expect initial burning'",
      "'I can apply it every 2 hours'",
      "'The cream provides continuous relief after one application'"
    ],
    correctAnswer: "'I should wear gloves when applying and expect initial burning'",
    explanation: "Capsaicin causes initial burning sensation (normal) that decreases with continued use. Apply 3-4 times daily. Wash hands after (or wear gloves)."
  },
  {
    q: "A client with low back pain from a herniated disk should be positioned how to decrease pain?",
    category: "oa-lbp",
    options: [
      "Prone without pillows",
      "Semi-Fowler's with a pillow under the knees",
      "High-Fowler's with knees flat",
      "Supine with head flat"
    ],
    correctAnswer: "Semi-Fowler's with a pillow under the knees",
    explanation: "Semi-Fowler's with pillow under flexed knees reduces pressure on the herniated disk and alleviates pain."
  },
  {
    q: "Which instruction should the nurse provide to prevent future low-back pain? (Select all that apply)",
    category: "oa-lbp",
    type: "sata",
    options: [
      "Engage in regular exercise including walking",
      "Sit for up to 10 hours each day",
      "Maintain healthy weight",
      "Create a smoking cessation plan",
      "Wear low-heeled shoes"
    ],
    correctAnswers: ["Engage in regular exercise including walking", "Maintain healthy weight", "Create a smoking cessation plan", "Wear low-heeled shoes"],
    explanation: "LBP prevention: exercise, healthy weight, quit smoking (linked to disk degeneration), low-heeled shoes, good posture. Avoid prolonged sitting."
  },
  {
    q: "A nurse is caring for a client post-laminectomy. Which finding requires immediate notification of the provider?",
    category: "oa-lbp",
    options: [
      "Mild incisional pain",
      "Clear fluid with a halo-like appearance on the dressing",
      "Difficulty turning in bed",
      "Mild nausea after anesthesia"
    ],
    correctAnswer: "Clear fluid with a halo-like appearance on the dressing",
    explanation: "Halo sign on dressing suggests CSF leakage, a serious complication requiring immediate provider notification. Also watch for sudden headache."
  },
  {
    q: "The maximum recommended daily dose of acetaminophen for long-term use is:",
    category: "oa-lbp",
    options: [
      "2,000 mg/day",
      "3,000 mg/day",
      "5,000 mg/day",
      "6,000 mg/day"
    ],
    correctAnswer: "3,000 mg/day",
    explanation: "Maximum acetaminophen is 4,000 mg/day, but experts recommend 3,000 mg/day for long-term use to prevent liver toxicity. Monitor liver function."
  },
  {
    q: "Which key difference distinguishes osteoarthritis from rheumatoid arthritis?",
    category: "oa-lbp",
    options: [
      "OA causes morning stiffness that improves with movement",
      "OA affects all joints symmetrically",
      "OA causes pain that worsens with activity and improves with rest",
      "OA is an inflammatory autoimmune disease"
    ],
    correctAnswer: "OA causes pain that worsens with activity and improves with rest",
    explanation: "OA: pain worse with activity, better with rest. RA: morning stiffness that improves with movement, symmetrical, inflammatory, systemic."
  },

  // ===== PHARMACOLOGY (8 additional questions) =====
  {
    q: "A client taking alendronate reports difficulty swallowing and substernal burning. The nurse should:",
    category: "pharmacology",
    options: [
      "Reassure the client this is a normal side effect",
      "Advise taking the medication with food",
      "Hold the medication and notify the provider immediately",
      "Suggest taking the medication at bedtime"
    ],
    correctAnswer: "Hold the medication and notify the provider immediately",
    explanation: "These symptoms suggest esophagitis/esophageal ulceration, a serious complication of bisphosphonates. Hold medication and notify provider."
  },
  {
    q: "Which medication should a client stop taking 7 days before joint replacement surgery?",
    category: "pharmacology",
    options: [
      "Acetaminophen (Tylenol)",
      "Ibuprofen (Advil)",
      "Gabapentin (Neurontin)",
      "Omeprazole (Prilosec)"
    ],
    correctAnswer: "Ibuprofen (Advil)",
    explanation: "NSAIDs like ibuprofen increase bleeding risk and should be stopped 7 days before surgery. Other blood thinners and supplements (fish oil) should also be stopped."
  },
  {
    q: "A client is prescribed enoxaparin (Lovenox) after hip replacement. The nurse should instruct the client to:",
    category: "pharmacology",
    options: [
      "Massage the injection site after administration",
      "Inject into the abdomen without rubbing afterward",
      "Inject into the thigh muscle only",
      "Take aspirin along with the medication"
    ],
    correctAnswer: "Inject into the abdomen without rubbing afterward",
    explanation: "Enoxaparin is given subcutaneously in the abdomen. Do not rub (causes bruising), do not aspirate, and rotate sites."
  },
  {
    q: "A client on long-term NSAID therapy should be monitored for:",
    category: "pharmacology",
    options: [
      "Hypoglycemia",
      "Nephrotoxicity and GI bleeding",
      "Respiratory depression",
      "Ototoxicity"
    ],
    correctAnswer: "Nephrotoxicity and GI bleeding",
    explanation: "NSAIDs can cause kidney damage (nephrotoxicity) and GI bleeding (ulcers). Monitor BUN, creatinine, and for black tarry stools."
  },
  {
    q: "Which instruction is correct for a client taking cyclobenzaprine (Flexeril) for muscle spasms?",
    category: "pharmacology",
    options: [
      "'Take this medication with alcohol to enhance effects'",
      "'Avoid driving as this medication may cause drowsiness'",
      "'Take only on an empty stomach'",
      "'This medication is safe for long-term use'"
    ],
    correctAnswer: "'Avoid driving as this medication may cause drowsiness'",
    explanation: "Muscle relaxants cause CNS depression/drowsiness. Avoid driving and alcohol. Typically used short-term (2-3 weeks)."
  },
  {
    q: "A client receiving IV morphine after fracture surgery has a respiratory rate of 8/min. The nurse's priority action is:",
    category: "pharmacology",
    options: [
      "Continue monitoring vital signs",
      "Hold the next morphine dose",
      "Administer naloxone (Narcan) as prescribed",
      "Encourage deep breathing exercises"
    ],
    correctAnswer: "Administer naloxone (Narcan) as prescribed",
    explanation: "Respiratory rate <10/min indicates opioid-induced respiratory depression. Administer naloxone (opioid antagonist) immediately and continue monitoring."
  },
  {
    q: "A client asks which supplement may help with osteoarthritis but increases bleeding risk. The nurse identifies:",
    category: "pharmacology",
    options: [
      "Calcium",
      "Vitamin D",
      "Chondroitin",
      "Vitamin B12"
    ],
    correctAnswer: "Chondroitin",
    explanation: "Chondroitin helps strengthen cartilage but increases bleeding risk, especially if taking anticoagulants. Inform provider of concurrent use with heparin or warfarin."
  },
  {
    q: "Signs of vitamin D toxicity include: (Select all that apply)",
    category: "pharmacology",
    type: "sata",
    options: [
      "Weakness and fatigue",
      "Increased energy",
      "Nausea and constipation",
      "Enhanced memory",
    ],
    correctAnswers: ["Weakness and fatigue", "Nausea and constipation", "Kidney stones"],
    explanation: "Vitamin D is fat-soluble; toxicity can occur. Signs: weakness, fatigue, nausea, constipation, and kidney stones. Monitor supplements carefully."
  }
];

// State
let currentCard = 0;
let currentQuestion = 0;
let score = 0;
let timerInterval = null;
let timeRemaining = 25 * 60;
let quizQuestions = [];

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Prepare quiz questions with shuffled answers - supports single and SATA
function prepareQuizQuestions() {
  quizQuestions = quizQuestionsBase.map(q => {
    const shuffledOptions = shuffleArray(q.options);

    // Handle SATA questions (multiple correct answers)
    if (q.type === 'sata' && q.correctAnswers) {
      const correctIndices = q.correctAnswers.map(ans => shuffledOptions.indexOf(ans));
      return {
        q: q.q,
        category: q.category || 'general',
        type: 'sata',
        options: shuffledOptions,
        correctIndices: correctIndices,
        explanation: q.explanation
      };
    }

    // Handle single-answer questions
    const correctIndex = shuffledOptions.indexOf(q.correctAnswer);
    return {
      q: q.q,
      category: q.category || 'general',
      type: 'single',
      options: shuffledOptions,
      correct: correctIndex,
      explanation: q.explanation
    };
  });
  // Also shuffle the question order
  quizQuestions = shuffleArray(quizQuestions);
}

// Filter questions by category
function filterQuestionsByCategory(category) {
  if (category === 'all') {
    return [...quizQuestionsBase];
  }
  return quizQuestionsBase.filter(q => q.category === category);
}

// Prepare quiz with settings
function prepareQuizWithSettings(category, count) {
  let filtered = filterQuestionsByCategory(category);

  quizQuestions = filtered.map(q => {
    const shuffledOptions = shuffleArray(q.options);

    if (q.type === 'sata' && q.correctAnswers) {
      const correctIndices = q.correctAnswers.map(ans => shuffledOptions.indexOf(ans));
      return {
        q: q.q,
        category: q.category || 'general',
        type: 'sata',
        options: shuffledOptions,
        correctIndices: correctIndices,
        explanation: q.explanation
      };
    }

    const correctIndex = shuffledOptions.indexOf(q.correctAnswer);
    return {
      q: q.q,
      category: q.category || 'general',
      type: 'single',
      options: shuffledOptions,
      correct: correctIndex,
      explanation: q.explanation
    };
  });

  quizQuestions = shuffleArray(quizQuestions);

  // Limit to requested count
  if (count > 0 && count < quizQuestions.length) {
    quizQuestions = quizQuestions.slice(0, count);
  }
}

// Main Tab Switching
function switchMainTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.main-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.maintab === tabName);
  });

  // Update tab panels
  document.querySelectorAll('.main-tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${tabName}`);
  });

  // Special handling for game panel - make it fullscreen
  const gamePanel = document.getElementById('panel-game');
  if (gamePanel) {
    if (tabName === 'game') {
      // Force fullscreen styling
      gamePanel.style.position = 'fixed';
      gamePanel.style.top = '0';
      gamePanel.style.left = '0';
      gamePanel.style.right = '0';
      gamePanel.style.bottom = '0';
      gamePanel.style.zIndex = '999';
      gamePanel.style.background = 'radial-gradient(ellipse at center, #0f0a1a 0%, #050510 100%)';
      gamePanel.style.paddingTop = '80px';
      gamePanel.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      // Initialize game
      setTimeout(() => {
        if (typeof initGame === 'function') {
          initGame();
        }
      }, 100);
    } else {
      // Reset game panel styles
      gamePanel.style.position = '';
      gamePanel.style.top = '';
      gamePanel.style.left = '';
      gamePanel.style.right = '';
      gamePanel.style.bottom = '';
      gamePanel.style.zIndex = '';
      gamePanel.style.background = '';
      gamePanel.style.paddingTop = '';
      gamePanel.style.overflow = '';
      document.body.style.overflow = '';

      // Stop game
      if (typeof stopGame === 'function') {
        stopGame();
      }
    }
  }

  // Scroll to top of content (only if not game)
  if (tabName !== 'game') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Update game stats display
function updateGameStats() {
  const highScore = localStorage.getItem('anatomyRunnerHighScore') || '0';
  const totalCoins = localStorage.getItem('anatomyRunnerCoins') || '0';
  const gamesPlayed = localStorage.getItem('anatomyRunnerGames') || '0';

  const highScoreEl = document.getElementById('gameHighScore');
  const totalCoinsEl = document.getElementById('gameTotalCoins');
  const gamesPlayedEl = document.getElementById('gamesPlayed');

  if (highScoreEl) highScoreEl.textContent = highScore;
  if (totalCoinsEl) totalCoinsEl.textContent = totalCoins;
  if (gamesPlayedEl) gamesPlayedEl.textContent = gamesPlayed;
}

// Initialize Main Tabs
function initMainTabs() {
  document.querySelectorAll('.main-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchMainTab(tab.dataset.maintab);
    });
  });

  // Quiz settings - Start Quiz button
  const startQuizBtn = document.getElementById('startQuizBtn');
  if (startQuizBtn) {
    startQuizBtn.addEventListener('click', () => {
      const category = document.getElementById('quizCategory').value;
      const count = parseInt(document.getElementById('quizCount').value);

      // Prepare questions with settings
      prepareQuizWithSettings(category, count);

      // Show quiz container, hide settings
      document.querySelector('.quiz-settings-panel').style.display = 'none';
      document.getElementById('quizMainContainer').style.display = 'block';

      // Reset quiz state
      currentQuestion = 0;
      score = 0;

      // Re-init quiz display
      showQuizQuestion();
    });
  }

  // Timer toggle buttons
  document.querySelectorAll('.timer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Scroll-based tab bar visibility
  const mainTabs = document.querySelector('.main-tabs');
  let lastScrollY = window.scrollY;

  // Show tabs at page load if at top
  if (window.scrollY < 100) {
    mainTabs.classList.add('at-top');
  }

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 100) {
      // At top of page
      mainTabs.classList.add('at-top');
      mainTabs.classList.remove('visible');
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up
      mainTabs.classList.add('visible');
      mainTabs.classList.remove('at-top');
    } else {
      // Scrolling down
      mainTabs.classList.remove('visible');
      mainTabs.classList.remove('at-top');
    }

    lastScrollY = currentScrollY;
  });
}

// Global selected answers for SATA
let sataSelectedAnswers = [];

// Show quiz question (extracted for reuse)
function showQuizQuestion() {
  const q = quizQuestions[currentQuestion];
  const isSata = q.type === 'sata';
  const optionsContainer = document.getElementById('quizOptions');

  document.getElementById('quizQuestion').textContent = q.q;
  document.getElementById('quizProgress').textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  document.getElementById('progressFill').style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
  document.getElementById('quizScore').textContent = `Score: ${score}`;

  optionsContainer.innerHTML = '';
  sataSelectedAnswers = [];

  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    if (isSata) btn.classList.add('sata-option');
    btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    btn.dataset.answer = index;

    // Add click handler based on question type
    if (isSata) {
      btn.addEventListener('click', () => handleSataOptionClick(btn, index));
    } else {
      btn.addEventListener('click', () => handleSingleOptionClick(index, q));
    }

    optionsContainer.appendChild(btn);
  });

  // Add submit button for SATA questions
  if (isSata) {
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary';
    submitBtn.textContent = '✓ Submit Answer';
    submitBtn.style.cssText = 'margin-top: 1rem;';
    submitBtn.addEventListener('click', () => handleSataSubmit(q));
    optionsContainer.appendChild(submitBtn);
  }

  document.getElementById('quizFeedback').style.display = 'none';
  document.getElementById('nextQuestion').style.display = 'none';
}

// Handle SATA option selection
function handleSataOptionClick(btn, index) {
  if (sataSelectedAnswers.includes(index)) {
    sataSelectedAnswers = sataSelectedAnswers.filter(a => a !== index);
    btn.classList.remove('selected');
  } else {
    sataSelectedAnswers.push(index);
    btn.classList.add('selected');
  }
}

// Handle SATA submit
function handleSataSubmit(q) {
  const options = document.querySelectorAll('#quizOptions .quiz-option');
  const correctSet = new Set(q.correctIndices);
  const selectedSet = new Set(sataSelectedAnswers);

  const isCorrect = correctSet.size === selectedSet.size &&
    [...correctSet].every(idx => selectedSet.has(idx));

  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    if (correctSet.has(i)) {
      opt.classList.add('correct');
    } else if (selectedSet.has(i)) {
      opt.classList.add('incorrect');
    }
  });

  // Remove submit button
  const submitBtn = document.querySelector('#quizOptions .btn-primary');
  if (submitBtn) submitBtn.remove();

  if (isCorrect) {
    score++;
    document.getElementById('quizScore').textContent = `Score: ${score}`;
  }

  showQuizFeedback(isCorrect, q.explanation);
}

// Handle single answer click
function handleSingleOptionClick(selected, q) {
  const options = document.querySelectorAll('#quizOptions .quiz-option');

  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    if (i === q.correct) {
      opt.classList.add('correct');
    } else if (i === selected && selected !== q.correct) {
      opt.classList.add('incorrect');
    }
  });

  if (selected === q.correct) {
    score++;
    document.getElementById('quizScore').textContent = `Score: ${score}`;
  }

  showQuizFeedback(selected === q.correct, q.explanation);
}

// Show feedback after answering
function showQuizFeedback(isCorrect, explanation) {
  const feedback = document.getElementById('quizFeedback');
  feedback.innerHTML = `
    <div class="glass-card" style="margin-top: 1rem; ${isCorrect ? 'border-color: var(--success);' : 'border-color: var(--danger);'}">
      <strong style="font-size: 1.2rem;">${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong>
      <p style="margin-top: 0.5rem; color: var(--text-secondary);">${explanation}</p>
    </div>`;
  feedback.style.display = 'block';
  document.getElementById('nextQuestion').style.display = 'inline-flex';
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  prepareQuizQuestions();
  initMainTabs();
  initNavigation();
  initTabs();
  initFlashcards();
  initQuiz();
  initTimer();
  initScrollAnimations();
  initCardMouseTracking();
});

// Card Mouse Tracking for Magnetic Effect
function initCardMouseTracking() {
  document.querySelectorAll('.topic-card, .glass-card, .p-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

// Navigation
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Active state on scroll
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section, .hero');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Tab System
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabContainer => {
    const tabs = tabContainer.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const tabId = this.dataset.tab;
        const section = this.closest('.section');

        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        // Handle different tab sections
        if (section && section.id === 'anatomy') {
          const cards = section.querySelectorAll('.topic-card');
          cards.forEach(card => {
            if (tabId && card.dataset.content === tabId) {
              card.style.display = 'block';
              card.style.animation = 'fadeInUp 0.5s ease';
            } else if (tabId) {
              card.style.display = 'none';
            } else {
              card.style.display = 'block';
            }
          });
        } else if (section && section.id === 'conditions') {
          const panels = document.querySelectorAll('.condition-panel');
          panels.forEach(panel => {
            if (panel.dataset.panel === tabId) {
              panel.classList.add('active');
              panel.style.display = 'block';
              panel.style.animation = 'fadeInUp 0.5s ease';
            } else {
              panel.classList.remove('active');
              panel.style.display = 'none';
            }
          });
        } else if (section && section.id === 'treatments') {
          const panels = document.querySelectorAll('.treatment-panel');
          panels.forEach(panel => {
            if (panel.dataset.panel === tabId) {
              panel.classList.add('active');
              panel.style.display = 'block';
              panel.style.animation = 'fadeInUp 0.5s ease';
            } else {
              panel.classList.remove('active');
              panel.style.display = 'none';
            }
          });
        }
      });
    });
  });
}

// Flashcards
function initFlashcards() {
  const flashcard = document.getElementById('flashcard');
  const prevBtn = document.getElementById('prevCard');
  const nextBtn = document.getElementById('nextCard');
  const shuffleBtn = document.getElementById('shuffleCards');
  const counter = document.getElementById('cardCounter');

  function updateCard() {
    const card = flashcards[currentCard];
    document.getElementById('flashcardQuestion').textContent = card.q;
    document.getElementById('flashcardAnswer').textContent = card.a;
    counter.textContent = `${currentCard + 1} / ${flashcards.length}`;
    flashcard.classList.remove('flipped');
  }

  flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
  });

  prevBtn.addEventListener('click', () => {
    currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
    updateCard();
  });

  nextBtn.addEventListener('click', () => {
    currentCard = (currentCard + 1) % flashcards.length;
    updateCard();
  });

  shuffleBtn.addEventListener('click', () => {
    for (let i = flashcards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    currentCard = 0;
    updateCard();
  });

  updateCard();
}

// Quiz with SHUFFLED answers
function initQuiz() {
  const optionsContainer = document.getElementById('quizOptions');
  const nextBtn = document.getElementById('nextQuestion');
  const restartBtn = document.getElementById('restartQuiz');
  let selectedAnswers = []; // Track selected answers for SATA

  function showQuestion() {
    const q = quizQuestions[currentQuestion];
    const isSata = q.type === 'sata';

    // Add SATA instruction if needed
    let questionText = q.q;
    if (isSata && !questionText.includes('Select all that apply')) {
      questionText = questionText;
    }

    document.getElementById('quizQuestion').textContent = questionText;
    document.getElementById('quizProgress').textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    document.getElementById('progressFill').style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
    document.getElementById('quizScore').textContent = `Score: ${score}`;

    optionsContainer.innerHTML = '';
    selectedAnswers = []; // Reset selections

    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      if (isSata) {
        btn.classList.add('sata-option');
      }
      btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
      btn.dataset.answer = index;
      btn.addEventListener('click', isSata ? handleSataSelection : handleAnswer);
      optionsContainer.appendChild(btn);
    });

    // Add submit button for SATA questions
    if (isSata) {
      const submitBtn = document.createElement('button');
      submitBtn.className = 'quiz-submit-btn';
      submitBtn.textContent = '✓ Submit Answer';
      submitBtn.style.cssText = 'margin-top: 1rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: 600;';
      submitBtn.addEventListener('click', handleSataSubmit);
      optionsContainer.appendChild(submitBtn);
    }

    document.getElementById('quizFeedback').style.display = 'none';
    nextBtn.style.display = 'none';
  }

  function handleSataSelection(e) {
    const selected = parseInt(e.target.dataset.answer);
    const btn = e.target;

    if (selectedAnswers.includes(selected)) {
      // Deselect
      selectedAnswers = selectedAnswers.filter(a => a !== selected);
      btn.classList.remove('selected');
    } else {
      // Select
      selectedAnswers.push(selected);
      btn.classList.add('selected');
    }
  }

  function handleSataSubmit() {
    const q = quizQuestions[currentQuestion];
    const options = optionsContainer.querySelectorAll('.quiz-option');
    const correctSet = new Set(q.correctIndices);
    const selectedSet = new Set(selectedAnswers);

    // Check if answer is correct (all correct selected, none wrong)
    const isCorrect = correctSet.size === selectedSet.size &&
      [...correctSet].every(idx => selectedSet.has(idx));

    options.forEach((opt, i) => {
      opt.removeEventListener('click', handleSataSelection);
      opt.style.pointerEvents = 'none';

      if (correctSet.has(i)) {
        opt.classList.add('correct');
      } else if (selectedSet.has(i) && !correctSet.has(i)) {
        opt.classList.add('incorrect');
      }
    });

    // Remove submit button
    const submitBtn = optionsContainer.querySelector('.quiz-submit-btn');
    if (submitBtn) submitBtn.remove();

    if (isCorrect) {
      score++;
      document.getElementById('quizScore').textContent = `Score: ${score}`;
    }

    const feedback = document.getElementById('quizFeedback');
    feedback.innerHTML = `
      <div class="glass-card" style="margin-top: 1rem; ${isCorrect ? 'border-color: var(--success);' : 'border-color: var(--danger);'}">
        <strong style="font-size: 1.2rem;">${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong>
        <p style="margin-top: 0.5rem; color: var(--text-secondary);">${q.explanation}</p>
      </div>`;
    feedback.style.display = 'block';
    nextBtn.style.display = 'inline-flex';
  }

  function handleAnswer(e) {
    const selected = parseInt(e.target.dataset.answer);
    const q = quizQuestions[currentQuestion];
    const options = optionsContainer.querySelectorAll('.quiz-option');

    options.forEach((opt, i) => {
      opt.removeEventListener('click', handleAnswer);
      opt.style.pointerEvents = 'none';
      if (i === q.correct) {
        opt.classList.add('correct');
      } else if (i === selected && selected !== q.correct) {
        opt.classList.add('incorrect');
      }
    });

    if (selected === q.correct) {
      score++;
      document.getElementById('quizScore').textContent = `Score: ${score}`;
    }

    const feedback = document.getElementById('quizFeedback');
    const isCorrect = selected === q.correct;
    feedback.innerHTML = `
      <div class="glass-card" style="margin-top: 1rem; ${isCorrect ? 'border-color: var(--success);' : 'border-color: var(--danger);'}">
        <strong style="font-size: 1.2rem;">${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong>
        <p style="margin-top: 0.5rem; color: var(--text-secondary);">${q.explanation}</p>
      </div>`;
    feedback.style.display = 'block';
    nextBtn.style.display = 'inline-flex';
  }

  nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  });

  function showResults() {
    document.getElementById('quizContent').style.display = 'none';
    nextBtn.style.display = 'none';
    const results = document.getElementById('quizResults');
    results.style.display = 'block';
    const percentage = Math.round((score / quizQuestions.length) * 100);
    document.getElementById('finalScore').textContent = `${percentage}%`;

    // Add encouraging message
    let message = '';
    if (percentage >= 90) message = '🎉 Outstanding! You really know this material!';
    else if (percentage >= 80) message = '👏 Great job! You\'re well prepared!';
    else if (percentage >= 70) message = '👍 Good work! Review the topics you missed.';
    else message = '📚 Keep studying! You\'ll get there!';

    const messageEl = document.createElement('p');
    messageEl.style.color = 'var(--text-primary)';
    messageEl.style.marginTop = '1rem';
    messageEl.style.fontSize = '1.1rem';
    messageEl.textContent = message;
    results.insertBefore(messageEl, document.getElementById('restartQuiz'));
  }

  restartBtn.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    prepareQuizQuestions(); // Reshuffle for new attempt
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';
    // Remove the encouragement message if exists
    const existingMessage = document.querySelector('#quizResults > p');
    if (existingMessage) existingMessage.remove();
    showQuestion();
  });

  showQuestion();
}

// Timer
function initTimer() {
  const display = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startTimer');
  const resetBtn = document.getElementById('resetTimer');
  const timeTabs = document.querySelectorAll('#timer .tab');
  let isRunning = false;

  function updateDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  startBtn.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timerInterval);
      startBtn.textContent = '▶️ Start';
    } else {
      timerInterval = setInterval(() => {
        timeRemaining--;
        updateDisplay();
        if (timeRemaining <= 0) {
          clearInterval(timerInterval);
          isRunning = false;
          startBtn.textContent = '▶️ Start';
          // Visual notification
          display.style.animation = 'pulse 0.5s ease 3';
          setTimeout(() => {
            display.style.animation = 'timerPulse 2s ease-in-out infinite';
            alert('⏰ Time is up! Take a break! 🎉');
          }, 1500);
        }
      }, 1000);
      startBtn.textContent = '⏸️ Pause';
    }
    isRunning = !isRunning;
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = '▶️ Start';
    const activeTab = document.querySelector('#timer .tab.active');
    timeRemaining = parseInt(activeTab.dataset.time) * 60;
    updateDisplay();
  });

  timeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      timeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = '▶️ Start';
      timeRemaining = parseInt(tab.dataset.time) * 60;
      updateDisplay();
    });
  });

  updateDisplay();
}

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';

        // Stagger child animations
        const children = entry.target.querySelectorAll('.topic-card, .glass-card, .p-card');
        children.forEach((child, index) => {
          child.style.animationDelay = `${index * 0.1}s`;
          child.style.animation = 'fadeInUp 0.6s ease both';
        });
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(section);
  });
}

// Add ripple effect to buttons
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn')) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      pointer-events: none;
      animation: ripple 0.6s ease-out;
    `;
    const rect = e.target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
    e.target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
});

// Add keyframe for ripple
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    from { transform: scale(0); opacity: 1; }
    to { transform: scale(4); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ============================================
// NEW FEATURES - ULTIMATE STUDY GUIDE V3.0
// ============================================

// Local Storage for Progress Tracking
const STORAGE_KEY = 'msk_study_guide';

function loadProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultProgress();
  } catch {
    return getDefaultProgress();
  }
}

function getDefaultProgress() {
  return {
    lastStudyDate: null,
    streak: 0,
    cardsMastered: 0,
    bestQuizScore: 0,
    cardConfidence: {}, // { cardIndex: confidenceLevel (0-3) }
    totalStudyTime: 0
  };
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.log('Could not save progress');
  }
}

// Update streak logic
function updateStudyStreak() {
  const progress = loadProgress();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (progress.lastStudyDate === today) {
    // Already studied today
  } else if (progress.lastStudyDate === yesterday) {
    // Studied yesterday, increment streak
    progress.streak++;
    progress.lastStudyDate = today;
  } else {
    // Missed a day, reset streak
    progress.streak = 1;
    progress.lastStudyDate = today;
  }

  saveProgress(progress);
  updateProgressDisplay();
}

function updateProgressDisplay() {
  const progress = loadProgress();

  // Update hero stats
  const streakEl = document.getElementById('studyStreak');
  if (streakEl) streakEl.textContent = progress.streak;

  const cardsEl = document.getElementById('cardsmastered');
  if (cardsEl) cardsEl.textContent = progress.cardsMastered;

  const quizEl = document.getElementById('quizBest');
  if (quizEl) quizEl.textContent = progress.bestQuizScore + '%';

  // Update mastery badge
  const masteryLevel = document.getElementById('masteryLevel');
  if (masteryLevel) {
    const mastery = Math.round((progress.cardsMastered / flashcards.length) * 100);
    masteryLevel.textContent = mastery + '%';
  }

  // Update flashcard stats
  updateFlashcardStats();
}

function updateFlashcardStats() {
  const progress = loadProgress();
  let newCount = 0;
  let learningCount = 0;
  let masteredCount = 0;

  flashcards.forEach((card, index) => {
    const confidence = progress.cardConfidence[index];
    if (confidence === undefined) newCount++;
    else if (confidence >= 3) masteredCount++;
    else learningCount++;
  });

  const newEl = document.getElementById('newCards');
  if (newEl) newEl.textContent = newCount;

  const learningEl = document.getElementById('learningCards');
  if (learningEl) learningEl.textContent = learningCount;

  const masteredEl = document.getElementById('masteredCards');
  if (masteredEl) masteredEl.textContent = masteredCount;

  // Update mastered cards in progress
  progress.cardsMastered = masteredCount;
  saveProgress(progress);
}

// Enhanced Flashcards with Confidence Rating
function initConfidenceButtons() {
  document.querySelectorAll('.confidence-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); // Don't flip card
      const confidence = parseInt(this.dataset.confidence);
      const progress = loadProgress();

      // Update confidence for current card
      const prevConfidence = progress.cardConfidence[currentCard] || 0;
      progress.cardConfidence[currentCard] = Math.max(prevConfidence, confidence);

      saveProgress(progress);
      updateFlashcardStats();
      updateProgressDisplay();

      // Visual feedback
      this.style.transform = 'scale(1.2)';
      setTimeout(() => {
        this.style.transform = '';
        // Auto advance to next card
        currentCard = (currentCard + 1) % flashcards.length;
        updateCardDisplay();
      }, 300);
    });
  });
}

function updateCardDisplay() {
  const card = flashcards[currentCard];
  const flashcard = document.getElementById('flashcard');

  document.getElementById('flashcardQuestion').textContent = card.q;
  document.getElementById('flashcardAnswer').textContent = card.a;
  document.getElementById('cardCounter').textContent = `${currentCard + 1} / ${flashcards.length}`;

  // Update category based on card content
  const categoryEl = document.getElementById('cardCategory');
  if (categoryEl) {
    if (card.q.toLowerCase().includes('compartment') || card.q.toLowerCase().includes('6 p')) {
      categoryEl.textContent = 'Emergency';
    } else if (card.q.toLowerCase().includes('osteo') || card.q.toLowerCase().includes('arthritis')) {
      categoryEl.textContent = 'Conditions';
    } else if (card.q.toLowerCase().includes('bone') || card.q.toLowerCase().includes('joint') || card.q.toLowerCase().includes('muscle')) {
      categoryEl.textContent = 'Anatomy';
    } else if (card.q.toLowerCase().includes('immobility') || card.q.toLowerCase().includes('complication')) {
      categoryEl.textContent = 'Complications';
    } else if (card.q.toLowerCase().includes('teaching') || card.q.toLowerCase().includes('nursing')) {
      categoryEl.textContent = 'Nursing';
    } else {
      categoryEl.textContent = 'Clinical';
    }
  }

  flashcard.classList.remove('flipped');
}

// Case Study Reveal Answers
function initRevealAnswers() {
  document.querySelectorAll('.reveal-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const container = this.closest('.answer-reveal');
      if (container) {
        container.classList.add('revealed');
      }
    });
  });
}

// Quiz Enhancement - Track weak areas
let weakAreas = [];

function trackQuizPerformance(questionIndex, wasCorrect, topic) {
  if (!wasCorrect) {
    const q = quizQuestions[questionIndex];
    weakAreas.push({
      question: q.q.substring(0, 100) + '...',
      explanation: q.explanation
    });
  }
}

function showWeakAreas() {
  const weakAreasEl = document.getElementById('weakAreas');
  if (weakAreasEl && weakAreas.length > 0) {
    weakAreasEl.innerHTML = `
      <h4>📚 Areas to Review</h4>
      ${weakAreas.slice(0, 5).map(area => `
        <div class="weak-area-item">
          <p><strong>Q:</strong> ${area.question}</p>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${area.explanation}</p>
        </div>
      `).join('')}
    `;
    weakAreasEl.style.display = 'block';
  }
}

// Update quiz to track performance
function enhanceQuiz() {
  const originalShowResults = window.showQuizResults;

  // After quiz ends, show weak areas and update best score
  const resultsDiv = document.getElementById('quizResults');
  if (resultsDiv) {
    const observer = new MutationObserver((mutations, obs) => {
      mutations.forEach(mutation => {
        if (mutation.target.style.display === 'block') {
          showWeakAreas();

          // Update best score
          const progress = loadProgress();
          const percentage = Math.round((score / quizQuestions.length) * 100);
          if (percentage > progress.bestQuizScore) {
            progress.bestQuizScore = percentage;
            saveProgress(progress);
            updateProgressDisplay();
          }
        }
      });
    });

    observer.observe(resultsDiv, { attributes: true, attributeFilter: ['style'] });
  }
}

// Initialize all new features
document.addEventListener('DOMContentLoaded', function () {
  // Update study streak on load
  updateStudyStreak();

  // Initialize reveal buttons
  initRevealAnswers();

  // Initialize diagram gallery
  initDiagramGallery();

  // Initialize confidence buttons
  setTimeout(() => {
    initConfidenceButtons();
    updateFlashcardStats();
    enhanceQuiz();
  }, 100);
});

// Diagram Gallery Data
const diagramInfo = {
  synovial: {
    title: 'Synovial Joint Structure',
    image: 'synovial_joint.png',
    content: `<p>The <strong>synovial joint</strong> is the most common and most movable type of joint in the body. Understanding its structure is essential for understanding arthritis and synovitis.</p>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Key Components:</h4>
    <ul>
      <li><strong>Articular Cartilage</strong> — Smooth covering on bone ends, wears down in OA</li>
      <li><strong>Synovial Membrane</strong> — Produces synovial fluid, attacked in RA</li>
      <li><strong>Synovial Fluid</strong> — Lubricates joint, distributes overnight (morning stiffness!)</li>
      <li><strong>Joint Capsule</strong> — Encloses joint, provides stability</li>
    </ul>
    <div class="mnemonic-card" style="margin-top: 1rem;">
      <div class="mnemonic-title">Clinical Connection</div>
      <p>In RA, the immune system attacks the synovial membrane → excess inflammatory fluid → joint destruction over time.</p>
    </div>`
  },
  bone: {
    title: 'Bone Structure & Anatomy',
    image: 'bone_structure.png',
    content: `<p>Understanding <strong>bone structure</strong> is key to understanding osteoporosis and fractures.</p>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Key Structures:</h4>
    <ul>
      <li><strong>Periosteum</strong> — Outer membrane with blood vessels and nerves</li>
      <li><strong>Compact Bone</strong> — Dense outer layer providing strength</li>
      <li><strong>Spongy (Trabecular) Bone</strong> — Inner lattice structure, affected FIRST in osteoporosis</li>
      <li><strong>Bone Marrow</strong> — Produces blood cells</li>
      <li><strong>Epiphyseal Plate</strong> — Growth plate in children</li>
    </ul>
    <div class="mnemonic-card" style="margin-top: 1rem;">
      <div class="mnemonic-title">Why This Matters for Osteoporosis</div>
      <p>Spongy bone has higher turnover and is affected first → hip and spine (vertebrae have lots of spongy bone) are common fracture sites.</p>
    </div>`
  },
  muscle: {
    title: 'Skeletal Muscle Anatomy',
    image: 'muscle_anatomy.png',
    content: `<p><strong>Skeletal muscles</strong> are organized into compartments — critical for understanding compartment syndrome.</p>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Key Points:</h4>
    <ul>
      <li><strong>Fascia</strong> — Tough membrane surrounding muscle compartments (doesn't stretch!)</li>
      <li><strong>Muscle Fibers</strong> — Contract to produce movement</li>
      <li><strong>Tendons</strong> — Connect muscle to bone at each end</li>
      <li><strong>Blood Vessels/Nerves</strong> — Run through compartments</li>
    </ul>
    <div class="mnemonic-card" style="margin-top: 1rem;">
      <div class="mnemonic-title">Compartment Syndrome Connection</div>
      <p>When pressure builds inside a compartment due to swelling, the fascia can't expand → blood vessels compressed → tissue death.</p>
    </div>`
  },
  tendon: {
    title: 'Tendons vs Ligaments',
    image: 'tendon_ligament.png',
    content: `<p>A common point of confusion on exams. Understanding this distinction is essential.</p>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">The Difference:</h4>
    <ul>
      <li><strong>TENDONS</strong> = Connect MUSCLE to BONE (Think: Tendon → To bone)</li>
      <li><strong>LIGAMENTS</strong> = Connect BONE to BONE (Think: Ligament → Links bones)</li>
    </ul>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Clinical Examples:</h4>
    <ul>
      <li><strong>Tendinitis</strong> = Inflammation of a tendon (e.g., Achilles tendinitis)</li>
      <li><strong>Sprain</strong> = Ligament injury (e.g., ankle sprain = ligament damage)</li>
      <li><strong>Strain</strong> = Muscle or tendon injury</li>
    </ul>`
  },
  hip: {
    title: 'Hip Fracture Types',
    image: 'hip_fractures.png',
    content: `<p><strong>Hip fractures</strong> are extremely common in elderly patients with osteoporosis.</p>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Three Main Types:</h4>
    <ul>
      <li><strong>Femoral Neck</strong> (Intracapsular) — Inside joint capsule, high risk of avascular necrosis</li>
      <li><strong>Intertrochanteric</strong> — Between greater and lesser trochanter</li>
      <li><strong>Subtrochanteric</strong> — Below the trochanters</li>
    </ul>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Clinical Presentation:</h4>
    <ul>
      <li>Shortened leg (affected side)</li>
      <li>External rotation of foot</li>
      <li>Severe pain in hip/groin</li>
      <li>Unable to bear weight</li>
    </ul>`
  },
  osteo: {
    title: 'Healthy vs Osteoporotic Bone',
    image: 'osteoporosis_comparison.png',
    content: `<p><strong>Osteoporosis</strong> is the "silent disease" — no symptoms until fracture occurs.</p>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">What's Happening:</h4>
    <ul>
      <li>Trabecular (spongy) bone loses density over time</li>
      <li>Bones become porous and fragile</li>
      <li>Minor trauma can cause fractures</li>
    </ul>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Risk Factors (memorize!):</h4>
    <ul>
      <li>Age >50, Female, Postmenopausal</li>
      <li>Low calcium/Vitamin D intake</li>
      <li>Smoking, Alcohol, Sedentary lifestyle</li>
      <li>Long-term steroid use</li>
    </ul>
    <div class="mnemonic-card" style="margin-top: 1rem;">
      <div class="mnemonic-title">Prevention Teaching</div>
      <p>Weight-bearing exercise + Calcium 1200mg/day + Vitamin D + No smoking = bone protection</p>
    </div>`
  },
  traction: {
    title: 'Traction Types: Skeletal vs Skin',
    image: 'traction_types.png',
    content: `<p><strong>Traction</strong> uses pulling force to align bones and keep them immobile during healing.</p>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Two Main Types:</h4>
    <ul>
      <li><strong>Skeletal Traction</strong> — Pins or wires inserted directly into bone. Used for long-term or heavy traction.</li>
      <li><strong>Skin Traction</strong> — Straps, tape, or foam applied to skin surface. Used short-term for lighter forces.</li>
    </ul>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Critical Rules (NEVER forget!):</h4>
    <ul>
      <li>Weights must hang FREELY at all times</li>
      <li>NEVER remove weights without order</li>
      <li>NEVER rest weights on floor or bed</li>
      <li>Check pin sites for infection signs</li>
    </ul>
    <div class="mnemonic-card" style="margin-top: 1rem;">
      <div class="mnemonic-title">NCLEX Priority</div>
      <p>If asked about repositioning a patient in traction, the weights stay on! Only reposition within allowed limits.</p>
    </div>`
  },
  dvt: {
    title: 'DVT Prevention Post-Surgery',
    image: 'dvt_prevention.png',
    content: `<p><strong>Deep Vein Thrombosis (DVT)</strong> is a major complication after orthopedic surgery due to Virchow's Triad.</p>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Virchow's Triad:</h4>
    <ul>
      <li><strong>Stasis</strong> — Blood pooling from immobility</li>
      <li><strong>Vessel Injury</strong> — From surgery itself</li>
      <li><strong>Hypercoagulability</strong> — Body's response to surgery</li>
    </ul>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">Prevention Methods:</h4>
    <ul>
      <li>Sequential compression devices (SCDs)</li>
      <li>Anticoagulant medications (Lovenox, Heparin)</li>
      <li>Early ambulation (get them moving!)</li>
      <li>Ankle pumps and leg exercises</li>
      <li>Adequate hydration</li>
    </ul>`
  },
  sixps: {
    title: 'The 6 P\'s of Neurovascular Assessment',
    image: 'six_ps_visual.png',
    content: `<p>The <strong>6 P's</strong> are critical for assessing neurovascular compromise — memorize these!</p>
    <h4 style="color: var(--primary-light); margin-top: 1rem;">The 6 P's:</h4>
    <ul>
      <li><strong>Pain</strong> — Out of proportion to injury, pain with passive stretch (EARLIEST sign!)</li>
      <li><strong>Pallor</strong> — Pale, dusky, or mottled appearance</li>
      <li><strong>Pulselessness</strong> — Weak or absent pulses (LATE sign)</li>
      <li><strong>Paresthesia</strong> — Numbness, tingling, "pins and needles"</li>
      <li><strong>Paralysis</strong> — Cannot move extremity (LATE sign)</li>
      <li><strong>Poikilothermia</strong> — Cold to touch, temperature change</li>
    </ul>
    <div class="mnemonic-card" style="margin-top: 1rem;">
      <div class="mnemonic-title">URGENT Action</div>
      <p>If 6 P's are present → suspect compartment syndrome → notify surgeon IMMEDIATELY → prepare for fasciotomy.</p>
    </div>`
  }
};

// Initialize Diagram Gallery
// Hotspot data for each diagram
const diagramHotspots = {
  synovial: [
    { x: 50, y: 20, pos: 'bottom', num: 1, title: 'Articular Cartilage', desc: 'Smooth layer covering bone ends. Wears down in osteoarthritis causing bone-on-bone grinding.' },
    { x: 30, y: 45, pos: 'right', num: 2, title: 'Synovial Membrane', desc: 'Produces synovial fluid. In RA, this membrane is attacked by the immune system.' },
    { x: 50, y: 60, pos: 'top', num: 3, title: 'Synovial Fluid', desc: 'Lubricates the joint. Redistributes overnight - explains morning stiffness!' },
    { x: 70, y: 35, pos: 'left', num: 4, title: 'Joint Capsule', desc: 'Encloses the entire joint. When compromised, leads to joint instability.' },
  ],
  bone: [
    { x: 50, y: 15, pos: 'bottom', num: 1, title: 'Epiphysis', desc: 'The rounded end of long bones. Contains spongy bone and growth plates in children.' },
    { x: 25, y: 40, pos: 'right', num: 2, title: 'Periosteum', desc: 'Outer membrane containing blood vessels and nerves. Very sensitive to pain!' },
    { x: 75, y: 50, pos: 'left', num: 3, title: 'Compact Bone', desc: 'Dense outer layer providing structural strength. Slower bone turnover.' },
    { x: 50, y: 50, pos: 'top', num: 4, title: 'Spongy Bone', desc: 'Trabecular bone affected FIRST in osteoporosis. High turnover rate.' },
    { x: 50, y: 75, pos: 'top', num: 5, title: 'Diaphysis', desc: 'The shaft of long bones. Contains bone marrow cavity.' },
  ],
  muscle: [
    { x: 30, y: 30, pos: 'right', num: 1, title: 'Fascia', desc: 'Tough membrane that can\'t stretch. Key to compartment syndrome!' },
    { x: 50, y: 50, pos: 'top', num: 2, title: 'Muscle Fibers', desc: 'Contract to produce movement. Atrophy occurs with immobility.' },
    { x: 70, y: 70, pos: 'left', num: 3, title: 'Tendon', desc: 'Connects muscle to bone. Remember: Tendon = To bone!' },
    { x: 50, y: 35, pos: 'bottom', num: 4, title: 'Blood Vessels', desc: 'Supply oxygen and nutrients. Compressed in compartment syndrome.' },
  ],
  tendon: [
    { x: 30, y: 50, pos: 'right', num: 1, title: 'TENDON', desc: 'Connects MUSCLE to BONE. Think: T = To bone. Injury = Strain.' },
    { x: 70, y: 50, pos: 'left', num: 2, title: 'LIGAMENT', desc: 'Connects BONE to BONE. Think: L = Links bones. Injury = Sprain.' },
  ],
  hip: [
    { x: 50, y: 25, pos: 'bottom', num: 1, title: 'Femoral Neck Fracture', desc: 'Intracapsular. HIGH risk of avascular necrosis due to blood supply disruption.' },
    { x: 35, y: 45, pos: 'right', num: 2, title: 'Intertrochanteric', desc: 'Between trochanters. Good blood supply, heals better.' },
    { x: 45, y: 70, pos: 'top', num: 3, title: 'Subtrochanteric', desc: 'Below trochanters. Often requires surgical fixation.' },
  ],
  osteo: [
    { x: 30, y: 50, pos: 'right', num: 1, title: 'Healthy Bone', desc: 'Dense trabecular structure. Strong and resilient.' },
    { x: 70, y: 50, pos: 'left', num: 2, title: 'Osteoporotic Bone', desc: 'Porous, thin trabeculae. Fragile - minor fall = fracture.' },
  ],
  traction: [
    { x: 25, y: 40, pos: 'right', num: 1, title: 'Skeletal Traction', desc: 'Pins in bone. For heavy/long-term traction. Check pin sites for infection!' },
    { x: 75, y: 40, pos: 'left', num: 2, title: 'Skin Traction', desc: 'Straps on skin. Short-term, lighter force. Check skin integrity!' },
    { x: 50, y: 80, pos: 'top', num: 3, title: 'Weights', desc: 'Must hang FREELY. Never remove, rest on floor, or adjust without order!' },
  ],
  dvt: [
    { x: 30, y: 40, pos: 'right', num: 1, title: 'Blood Clot', desc: 'Forms in deep veins due to stasis, injury, or hypercoagulability.' },
    { x: 70, y: 30, pos: 'left', num: 2, title: 'SCDs', desc: 'Sequential compression devices prevent blood pooling.' },
    { x: 70, y: 60, pos: 'left', num: 3, title: 'Anticoagulants', desc: 'Lovenox, Heparin prevent clot formation post-surgery.' },
    { x: 50, y: 80, pos: 'top', num: 4, title: 'Early Ambulation', desc: 'Get them moving! Best prevention for DVT.' },
  ],
  sixps: [
    { x: 20, y: 25, pos: 'right', num: 1, title: 'Pain', desc: 'Out of proportion to injury. Pain with passive stretch = EARLIEST sign!' },
    { x: 50, y: 15, pos: 'bottom', num: 2, title: 'Pallor', desc: 'Pale, dusky, or mottled appearance of the extremity.' },
    { x: 80, y: 25, pos: 'left', num: 3, title: 'Pulselessness', desc: 'Weak or absent pulses. This is a LATE sign - don\'t wait for it!' },
    { x: 20, y: 70, pos: 'right', num: 4, title: 'Paresthesia', desc: 'Numbness, tingling, "pins and needles" sensation.' },
    { x: 50, y: 80, pos: 'top', num: 5, title: 'Paralysis', desc: 'Cannot move extremity. LATE sign indicating severe damage.' },
    { x: 80, y: 70, pos: 'left', num: 6, title: 'Poikilothermia', desc: 'Cold to touch. Temperature difference from unaffected limb.' },
  ]
};

// Initialize Diagram Gallery
function initDiagramGallery() {
  document.querySelectorAll('.diagram-card').forEach(card => {
    card.addEventListener('click', function () {
      const diagramKey = this.dataset.diagram;
      const info = diagramInfo[diagramKey];
      const hotspots = diagramHotspots[diagramKey] || [];
      if (info) {
        openImageModal(info, hotspots);
      }
    });
  });

  // Close on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeImageModal();
    }
  });

  // Close on backdrop click
  const modal = document.getElementById('diagramModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeImageModal();
      }
    });
  }
}

// Open modal
function openImageModal(info, hotspots) {
  const modal = document.getElementById('diagramModal');
  const img = document.getElementById('modalImage');
  const hotspotsEl = document.getElementById('hotspotsLayer');
  const infoEl = document.getElementById('modalInfo');
  const titleEl = document.getElementById('modalTitle');

  if (!modal || !img || !infoEl) return;

  // Set title in header
  if (titleEl) titleEl.textContent = info.title;

  img.src = info.image;
  img.alt = info.title;

  // Build hotspots using CSS classes
  if (hotspotsEl) {
    hotspotsEl.innerHTML = hotspots.map(h => `
      <div class="hotspot-point" style="left:${h.x}%; top:${h.y}%;">
        ${h.num}
        <div class="hotspot-tip">
          <strong>${h.title}</strong>
          <span>${h.desc}</span>
        </div>
      </div>
    `).join('');
  }

  // Build info content
  const hintHTML = hotspots.length > 0 ? '<div class="hint-text">💡 Hover the numbered points on the image for details</div>' : '';
  infoEl.innerHTML = hintHTML + info.content;

  // Reset scroll position on the scroll container and show modal
  const scrollContainer = modal.querySelector('.diagram-modal-scroll');
  if (scrollContainer) scrollContainer.scrollTop = 0;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeImageModal() {
  const modal = document.getElementById('diagramModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// ============================================
// PREMIUM GAMIFICATION SYSTEM V4.0
// ============================================

// XP & Leveling System
const XP_CONFIG = {
  correctAnswer: 25,
  perfectQuiz: 200,
  flashcardMastered: 50,
  dailyLogin: 100,
  streakBonus: 25, // per day
  achievements: {
    firstPerfect: 500,
    tenStreak: 300,
    allCards: 1000,
    speedDemon: 250
  }
};

const LEVELS = [
  { name: 'Nursing Student', minXP: 0, icon: '📚' },
  { name: 'Clinical Rookie', minXP: 500, icon: '🩺' },
  { name: 'Ward Nurse', minXP: 1500, icon: '💉' },
  { name: 'Charge Nurse', minXP: 3500, icon: '⭐' },
  { name: 'Clinical Expert', minXP: 7000, icon: '🏆' },
  { name: 'MSK Master', minXP: 15000, icon: '👑' }
];

const ACHIEVEMENTS = [
  { id: 'first_quiz', name: 'First Steps', desc: 'Complete your first quiz', icon: '🎯', xp: 100 },
  { id: 'perfect_score', name: 'Perfect Score', desc: 'Get 100% on a quiz', icon: '💯', xp: 500 },
  { id: 'streak_3', name: 'On Fire', desc: '3-day study streak', icon: '🔥', xp: 150 },
  { id: 'streak_7', name: 'Dedicated', desc: '7-day study streak', icon: '⚡', xp: 300 },
  { id: 'streak_14', name: 'Unstoppable', desc: '14-day study streak', icon: '🌟', xp: 500 },
  { id: 'cards_10', name: 'Getting Started', desc: 'Master 10 flashcards', icon: '📇', xp: 100 },
  { id: 'cards_25', name: 'Making Progress', desc: 'Master 25 flashcards', icon: '🎴', xp: 250 },
  { id: 'cards_50', name: 'Card Master', desc: 'Master all 50 flashcards', icon: '🃏', xp: 1000 },
  { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete quiz in under 2 mins', icon: '⚡', xp: 250 },
  { id: 'night_owl', name: 'Night Owl', desc: 'Study after midnight', icon: '🦉', xp: 100 },
  { id: 'early_bird', name: 'Early Bird', desc: 'Study before 7 AM', icon: '🐦', xp: 100 }
];

// Extended storage for gamification
function loadGameData() {
  try {
    const data = localStorage.getItem('msk_game_data');
    return data ? JSON.parse(data) : getDefaultGameData();
  } catch {
    return getDefaultGameData();
  }
}

function getDefaultGameData() {
  return {
    xp: 0,
    level: 0,
    achievements: [],
    quizHistory: [],
    dailyChallenge: null,
    dailyChallengeCompleted: false,
    lastDailyReset: null,
    theme: 'dark',
    totalQuizzes: 0,
    totalCorrect: 0,
    fastestQuiz: null
  };
}

function saveGameData(data) {
  try {
    localStorage.setItem('msk_game_data', JSON.stringify(data));
  } catch (e) {
    console.log('Could not save game data');
  }
}

// XP System
function addXP(amount, reason = '') {
  const gameData = loadGameData();
  const oldLevel = getCurrentLevel(gameData.xp);
  gameData.xp += amount;
  const newLevel = getCurrentLevel(gameData.xp);
  saveGameData(gameData);

  // Show XP popup
  showXPPopup(amount, reason);

  // Level up notification
  if (newLevel.name !== oldLevel.name) {
    showLevelUpNotification(newLevel);
  }

  updateXPDisplay();
}

function getCurrentLevel(xp) {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXP) {
      currentLevel = level;
    }
  }
  return currentLevel;
}

function getNextLevel(xp) {
  for (const level of LEVELS) {
    if (xp < level.minXP) {
      return level;
    }
  }
  return LEVELS[LEVELS.length - 1];
}

function showXPPopup(amount, reason) {
  const popup = document.createElement('div');
  popup.className = 'xp-popup';
  popup.innerHTML = `+${amount} XP${reason ? ` <span class="xp-reason">${reason}</span>` : ''}`;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add('show'), 10);
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 300);
  }, 2000);
}

function showLevelUpNotification(level) {
  const notification = document.createElement('div');
  notification.className = 'level-up-notification';
  notification.innerHTML = `
    <div class="level-up-icon">${level.icon}</div>
    <div class="level-up-text">
      <div class="level-up-title">LEVEL UP!</div>
      <div class="level-up-name">${level.name}</div>
    </div>
  `;
  document.body.appendChild(notification);

  triggerConfetti();

  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}

function updateXPDisplay() {
  const gameData = loadGameData();
  const currentLevel = getCurrentLevel(gameData.xp);
  const nextLevel = getNextLevel(gameData.xp);

  const xpBarFill = document.getElementById('xpBarFill');
  const xpText = document.getElementById('xpText');
  const levelBadge = document.getElementById('levelBadge');
  const levelName = document.getElementById('levelName');

  if (xpBarFill && xpText) {
    const progress = nextLevel.minXP > currentLevel.minXP
      ? ((gameData.xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
      : 100;
    xpBarFill.style.width = `${progress}%`;
    xpText.textContent = `${gameData.xp.toLocaleString()} / ${nextLevel.minXP.toLocaleString()} XP`;
  }

  if (levelBadge) {
    levelBadge.textContent = currentLevel.icon;
  }

  if (levelName) {
    levelName.textContent = currentLevel.name;
  }
}

// Achievements System
function checkAchievements() {
  const gameData = loadGameData();
  const progress = loadProgress();

  const checks = [
    { id: 'first_quiz', condition: gameData.totalQuizzes >= 1 },
    { id: 'perfect_score', condition: progress.bestQuizScore >= 100 },
    { id: 'streak_3', condition: progress.streak >= 3 },
    { id: 'streak_7', condition: progress.streak >= 7 },
    { id: 'streak_14', condition: progress.streak >= 14 },
    { id: 'cards_10', condition: progress.cardsMastered >= 10 },
    { id: 'cards_25', condition: progress.cardsMastered >= 25 },
    { id: 'cards_50', condition: progress.cardsMastered >= 50 },
    { id: 'night_owl', condition: new Date().getHours() >= 0 && new Date().getHours() < 5 },
    { id: 'early_bird', condition: new Date().getHours() >= 5 && new Date().getHours() < 7 }
  ];

  checks.forEach(check => {
    if (check.condition && !gameData.achievements.includes(check.id)) {
      unlockAchievement(check.id);
    }
  });
}

function unlockAchievement(id) {
  const achievement = ACHIEVEMENTS.find(a => a.id === id);
  if (!achievement) return;

  const gameData = loadGameData();
  if (gameData.achievements.includes(id)) return;

  gameData.achievements.push(id);
  saveGameData(gameData);

  // Show achievement notification
  showAchievementNotification(achievement);

  // Award XP
  addXP(achievement.xp, achievement.name);

  // Update achievements display
  updateAchievementsDisplay();
}

function showAchievementNotification(achievement) {
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-icon">${achievement.icon}</div>
    <div class="achievement-info">
      <div class="achievement-unlocked">Achievement Unlocked!</div>
      <div class="achievement-name">${achievement.name}</div>
      <div class="achievement-desc">${achievement.desc}</div>
    </div>
  `;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}

function updateAchievementsDisplay() {
  const container = document.getElementById('achievementsList');
  if (!container) return;

  const gameData = loadGameData();

  container.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = gameData.achievements.includes(a.id);
    return `
      <div class="achievement-badge ${unlocked ? 'unlocked' : 'locked'}">
        <div class="badge-icon">${a.icon}</div>
        <div class="badge-info">
          <div class="badge-name">${a.name}</div>
          <div class="badge-desc">${a.desc}</div>
        </div>
        ${unlocked ? '<div class="badge-check">✓</div>' : ''}
      </div>
    `;
  }).join('');
}

// Confetti Animation
function triggerConfetti() {
  const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
  const confettiCount = 150;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.5}s;
      animation-duration: ${2 + Math.random() * 2}s;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

// Quiz Answer Animations
function animateCorrectAnswer(element) {
  element.classList.add('answer-correct');
  element.innerHTML += ' <span class="answer-feedback">✓ Correct!</span>';

  // Pulse effect
  const pulse = document.createElement('div');
  pulse.className = 'pulse-ring';
  element.appendChild(pulse);
  setTimeout(() => pulse.remove(), 600);
}

function animateIncorrectAnswer(element) {
  element.classList.add('answer-incorrect');
  element.classList.add('shake');
  element.innerHTML += ' <span class="answer-feedback">✗ Incorrect</span>';
  setTimeout(() => element.classList.remove('shake'), 500);
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Only active when flashcards panel is visible
    const flashcardsPanel = document.getElementById('panel-flashcards');
    if (!flashcardsPanel || !flashcardsPanel.classList.contains('active')) return;

    const flashcard = document.getElementById('flashcard');
    if (!flashcard) return;

    switch (e.key) {
      case 'f':
      case 'F':
      case ' ':
        e.preventDefault();
        flashcard.classList.toggle('flipped');
        break;
      case '1':
        e.preventDefault();
        document.querySelector('.confidence-btn[data-confidence="0"]')?.click();
        break;
      case '2':
        e.preventDefault();
        document.querySelector('.confidence-btn[data-confidence="1"]')?.click();
        break;
      case '3':
        e.preventDefault();
        document.querySelector('.confidence-btn[data-confidence="2"]')?.click();
        break;
      case '4':
        e.preventDefault();
        document.querySelector('.confidence-btn[data-confidence="3"]')?.click();
        break;
      case 'ArrowRight':
        e.preventDefault();
        currentCard = (currentCard + 1) % flashcards.length;
        updateCardDisplay();
        if (flashcard.classList.contains('flipped')) {
          flashcard.classList.remove('flipped');
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
        updateCardDisplay();
        if (flashcard.classList.contains('flipped')) {
          flashcard.classList.remove('flipped');
        }
        break;
    }
  });
}

// Theme Toggle
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const gameData = loadGameData();
  if (gameData.theme === 'light') {
    document.body.classList.add('light-theme');
    toggle.textContent = '🌙';
  }

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    toggle.textContent = isLight ? '🌙' : '☀️';

    const data = loadGameData();
    data.theme = isLight ? 'light' : 'dark';
    saveGameData(data);
  });
}

// Daily Challenge
function initDailyChallenge() {
  const gameData = loadGameData();
  const today = new Date().toDateString();

  if (gameData.lastDailyReset !== today) {
    // Generate new daily challenge
    const challenges = [
      { type: 'quiz', target: 1, desc: 'Complete 1 quiz', xp: 150 },
      { type: 'cards', target: 10, desc: 'Review 10 flashcards', xp: 100 },
      { type: 'perfect', target: 1, desc: 'Get a perfect quiz score', xp: 300 },
      { type: 'streak', target: 1, desc: 'Maintain your study streak', xp: 100 }
    ];

    gameData.dailyChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    gameData.dailyChallengeCompleted = false;
    gameData.lastDailyReset = today;
    saveGameData(gameData);
  }

  updateDailyChallengeDisplay();
}

function updateDailyChallengeDisplay() {
  const container = document.getElementById('dailyChallenge');
  if (!container) return;

  const gameData = loadGameData();
  const challenge = gameData.dailyChallenge;

  if (!challenge) return;

  container.innerHTML = `
    <div class="daily-challenge-header">
      <span class="daily-icon">🎯</span>
      <span class="daily-title">Daily Challenge</span>
      ${gameData.dailyChallengeCompleted ? '<span class="daily-complete">✓ Complete!</span>' : ''}
    </div>
    <div class="daily-desc">${challenge.desc}</div>
    <div class="daily-reward">
      <span class="reward-icon">⭐</span>
      <span class="reward-xp">+${challenge.xp} XP</span>
    </div>
  `;

  if (gameData.dailyChallengeCompleted) {
    container.classList.add('completed');
  }
}

// Enhanced Quiz with Gamification
function enhanceQuizWithGamification() {
  // Hook into existing quiz completion
  const originalRestartBtn = document.getElementById('restartQuiz');
  if (!originalRestartBtn) return;

  // Observe quiz results for gamification
  const resultsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.style.display !== 'none') {
        handleQuizCompletion();
      }
    });
  });

  const quizResults = document.getElementById('quizResults');
  if (quizResults) {
    resultsObserver.observe(quizResults, { attributes: true, attributeFilter: ['style'] });
  }
}

function handleQuizCompletion() {
  const scoreEl = document.querySelector('#quizResults .score-value');
  if (!scoreEl) return;

  const score = parseInt(scoreEl.textContent);
  const gameData = loadGameData();

  // Increment quiz count
  gameData.totalQuizzes++;
  saveGameData(gameData);

  // Award XP based on score
  const xpEarned = Math.round(score * 2);
  addXP(xpEarned, 'Quiz Complete');

  // Perfect score bonus
  if (score === 100) {
    addXP(XP_CONFIG.perfectQuiz, 'Perfect Score!');
    triggerConfetti();
  }

  // Check achievements
  checkAchievements();
}

// Mobile Swipe Gestures for Flashcards
function initSwipeGestures() {
  const flashcard = document.getElementById('flashcard');
  if (!flashcard) return;

  let startX = 0;
  let startY = 0;
  let isDragging = false;

  flashcard.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  flashcard.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      flashcard.style.transform = `translateX(${deltaX * 0.5}px) rotate(${deltaX * 0.02}deg)`;
    }
  }, { passive: true });

  flashcard.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;

    flashcard.style.transform = '';

    if (deltaX > 100) {
      // Swipe right - Got it (confidence 3)
      document.querySelector('.confidence-btn[data-confidence="3"]')?.click();
    } else if (deltaX < -100) {
      // Swipe left - Again (confidence 0)
      document.querySelector('.confidence-btn[data-confidence="0"]')?.click();
    }
  }, { passive: true });
}

// Initialize all gamification features
function initGamification() {
  updateXPDisplay();
  updateAchievementsDisplay();
  initKeyboardShortcuts();
  initThemeToggle();
  initDailyChallenge();
  enhanceQuizWithGamification();
  initSwipeGestures();
  checkAchievements();

  // Daily login XP
  const gameData = loadGameData();
  const today = new Date().toDateString();
  if (gameData.lastDailyReset !== today) {
    addXP(XP_CONFIG.dailyLogin, 'Daily Login');
  }
}

// Run gamification init after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGamification);
} else {
  setTimeout(initGamification, 100);
}
