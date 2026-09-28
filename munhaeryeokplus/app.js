const books=[
  {id:"book-animalfarm",title:"동물농장",author:"조지 오웰",level:"중등",category:"사회·정치",desc:"권력은 왜 부패하는가를 우화로 생각해 보는 고전.",questions:["혁명 이후 동물들의 사회가 다시 불평등해진 이유는 무엇일까?","언어와 정보의 통제는 권력을 유지하는 데 어떤 역할을 할까?","공정한 공동체를 만들기 위해 필요한 조건은 무엇일까?"]},
  {id:"book-demian",title:"데미안",author:"헤르만 헤세",level:"고등",category:"인문·성장",desc:"자기 정체성과 성장의 의미를 질문하게 하는 작품.",questions:["‘자기 자신이 된다’는 것은 무엇을 의미할까?","사회의 기준과 개인의 선택이 충돌할 때 어떤 기준이 필요할까?","성장 과정에서 불안과 혼란은 왜 필요한가?"]},
  {id:"book-littleprince",title:"어린 왕자",author:"생텍쥐페리",level:"초등",category:"문학·관계",desc:"관계, 책임, 소중함을 쉽지만 깊게 생각할 수 있는 작품.",questions:["어린 왕자에게 장미는 왜 특별한 존재가 되었을까?","‘길들인다’는 말은 관계에서 어떤 의미일까?","눈에 보이지 않지만 중요한 것은 무엇일까?"]},
  {id:"book-justice",title:"정의란 무엇인가",author:"마이클 샌델",level:"고등",category:"사회·윤리",desc:"공정함과 정의를 판단하는 여러 기준을 비교하는 책.",questions:["공정하다는 것은 모두에게 같은 것을 주는 것일까?","개인의 자유는 공동체의 이익보다 언제 우선할 수 있을까?","좋은 사회는 어떤 가치에 합의해야 할까?"]},
  {id:"book-sapiens",title:"사피엔스",author:"유발 하라리",level:"고등",category:"역사·문명",desc:"인간 사회와 문명의 형성을 큰 흐름에서 바라보는 책.",questions:["인간이 대규모 협력을 할 수 있게 된 원인은 무엇일까?","공유된 믿음은 사회를 만들지만 어떤 문제도 낳을까?","문명의 발전을 행복의 증가라고 볼 수 있을까?"]},
  {id:"book-giver",title:"기억 전달자",author:"로이스 로리",level:"중등",category:"사회·윤리",desc:"고통을 없앤 사회가 정말 행복한 사회인지 질문하게 하는 소설.",questions:["고통이 없는 사회는 더 좋은 사회일까?","선택의 자유가 사라지면 어떤 문제가 생길까?","기억은 개인과 공동체에 왜 중요한가?"]},
  {id:"book-fahrenheit",title:"화씨 451",author:"레이 브래드버리",level:"고등",category:"사회·미디어",desc:"책과 사유가 사라진 사회를 통해 정보와 자유를 생각하는 작품.",questions:["사람들이 스스로 책을 멀리하게 되는 이유는 무엇일까?","오락이 사고를 대신하면 어떤 문제가 생길까?","표현의 자유와 사회적 불편은 어떻게 조정해야 할까?"]},
  {id:"book-wonder",title:"원더",author:"R. J. 팔라시오",level:"초등",category:"문학·공감",desc:"다름을 바라보는 시선과 공감의 태도를 생각하게 하는 성장소설.",questions:["친절은 왜 용기가 필요한 행동일까?","외모에 대한 첫인상은 사람을 얼마나 정확히 보여 줄까?","학교 공동체는 ‘다름’을 어떻게 받아들여야 할까?"]}
];

const topics=[
  {id:"topic-critical-reading",type:"주제읽기",category:"인문",level:"중등·고등",title:"비판적 읽기란 무엇인가",summary:"글의 내용을 믿거나 의심하는 것이 아니라, 주장과 근거의 관계를 검토하는 읽기 방법.",body:["비판적 읽기는 글쓴이의 주장에 무조건 반대하는 태도가 아니다. 오히려 글이 어떤 질문에 답하고 있는지, 어떤 근거를 사용하는지, 그 근거가 결론을 충분히 뒷받침하는지를 차례로 확인하는 읽기다.","같은 사실도 어떤 관점에서 배열하느냐에 따라 다른 결론으로 이어질 수 있다. 그래서 독자는 제시된 정보뿐 아니라 빠진 정보, 사용된 개념의 의미, 반대 사례의 가능성까지 살펴볼 필요가 있다.","비판적 읽기의 핵심은 ‘의심’보다 ‘검토’에 가깝다. 주장·근거·전제·반례를 구분해서 읽으면 독자는 글쓴이의 결론을 그대로 받아들이지 않고 자신의 판단을 만들 수 있다."],questions:["이 글에서 주장과 근거를 구분해 보자.","글쓴이가 당연하다고 전제한 내용은 무엇일까?","반대 사례를 하나 만든다면 어떤 것이 가능할까?"]},
  {id:"topic-filterbubble",type:"주제읽기",category:"사회",level:"중등·고등",title:"필터 버블과 확증편향",summary:"내가 보고 싶은 정보만 계속 보게 될 때 판단은 어떻게 달라질까?",body:["온라인 플랫폼은 사용자의 관심과 행동을 바탕으로 비슷한 콘텐츠를 추천한다. 편리하지만 비슷한 관점만 반복해서 접하게 만들 수도 있다.","사람은 원래 자신의 기존 생각을 지지하는 정보를 더 쉽게 받아들이는 경향이 있다. 추천 알고리즘과 이러한 확증편향이 결합하면 다른 관점을 접할 기회가 줄어들 수 있다.","따라서 정보의 신뢰성을 판단하려면 출처만 보는 것이 아니라, 서로 다른 입장의 자료를 의식적으로 비교하고 무엇이 사실이며 무엇이 해석인지 구분해야 한다."],questions:["추천 알고리즘의 장점과 단점을 각각 찾아보자.","확증편향이 토론에 어떤 영향을 줄 수 있을까?","다른 관점을 일부러 찾아보는 습관은 왜 필요할까?"]},
  {id:"topic-choice",type:"주제읽기",category:"인문",level:"초등·중등",title:"선택지가 많으면 더 행복할까",summary:"선택의 자유와 선택의 부담이 어떻게 함께 커지는지 생각해 봅니다.",body:["선택할 수 있는 것이 많다는 것은 자유가 넓다는 뜻이다. 하지만 선택지가 많아질수록 비교해야 할 정보도 많아지고, 선택하지 않은 대안의 장점도 더 쉽게 떠오른다.","그래서 만족스러운 선택을 위해서는 가능한 선택지를 무한히 늘리는 것보다 자신에게 중요한 기준을 정하는 일이 중요하다.","무엇을 선택했는가보다 왜 그것을 선택했는지 설명할 수 있을 때 선택에 대한 책임과 만족도도 높아질 수 있다."],questions:["최근 내가 한 선택 중 기준이 분명했던 것은 무엇인가?","선택지가 너무 많아 오히려 힘들었던 경험이 있었나?","좋은 선택을 위한 기준은 어떻게 만들 수 있을까?"]},
  {id:"topic-ai-literacy",type:"주제읽기",category:"과학·기술",level:"중등·고등",title:"AI 시대의 문해력",summary:"요약을 잘하는 AI가 등장한 시대에 인간의 읽기 능력은 왜 더 중요해질까?",body:["AI는 긴 글을 빠르게 요약하고 필요한 정보를 정리해 준다. 그러나 요약이 정확한지, 어떤 관점이 빠졌는지 판단하는 일은 여전히 독자의 몫이다.","문해력은 단순히 글자를 읽는 능력이 아니라 정보를 해석하고 연결하고 평가하는 능력이다. 정보가 많아질수록 이러한 판단 능력의 중요성은 더 커진다.","AI 시대의 읽기 교육은 더 많은 내용을 암기하는 방향보다, 질문을 만들고 근거를 확인하고 서로 다른 관점을 비교하는 방향으로 이동할 필요가 있다."],questions:["AI 요약을 그대로 믿으면 생길 수 있는 문제는 무엇인가?","인간 독자가 반드시 해야 하는 판단은 무엇일까?","학교 수업은 AI 시대에 어떻게 달라져야 할까?"]},
  {id:"topic-fairness",type:"주제읽기",category:"사회",level:"고등",title:"공정함은 모두에게 똑같이 대하는 것일까",summary:"같은 기준과 다른 지원 중 무엇이 더 공정한지 생각해 보는 글.",body:["공정함을 ‘모두에게 같은 기준을 적용하는 것’이라고 이해할 수 있다. 하지만 출발 조건이 크게 다를 때 동일한 기준이 오히려 불리함을 고착시킬 수 있다는 반론도 있다.","반대로 각자의 상황에 맞게 다른 지원을 제공하면 결과의 격차를 줄일 수 있지만, 기준의 일관성이 약해졌다고 느끼는 사람도 생길 수 있다.","그래서 공정성 논쟁에서는 ‘같게 대할 것인가’만이 아니라 어떤 차이를 고려해야 하며 그 차이를 왜 정당하게 볼 수 있는지를 설명하는 일이 중요하다."],questions:["동일한 기준의 장점은 무엇인가?","상황에 따른 다른 지원이 필요한 사례를 생각해 보자.","공정함을 판단할 때 어떤 기준을 가장 중요하게 보아야 할까?"]},
  {id:"topic-media",type:"주제읽기",category:"미디어",level:"중등",title:"뉴스의 제목만 읽어도 충분할까",summary:"제목과 짧은 영상 중심의 정보 소비가 판단에 미치는 영향을 살펴봅니다.",body:["뉴스 제목은 독자의 관심을 끌고 핵심 내용을 빠르게 전달해야 한다. 하지만 제한된 글자 수 안에서 내용을 단순화하다 보면 본문의 조건이나 예외가 빠질 수 있다.","특히 감정적인 표현이나 강한 단어는 클릭을 높일 수 있지만 사건을 실제보다 단순하게 이해하게 만들 수도 있다.","따라서 제목을 정보의 출발점으로 활용하되 중요한 판단을 할 때에는 본문과 출처, 근거 자료를 함께 확인하는 습관이 필요하다."],questions:["제목이 본문과 다른 인상을 주는 이유는 무엇일까?","감정적인 단어가 판단에 어떤 영향을 줄까?","신뢰할 만한 정보를 확인하는 순서를 만들어 보자."]}
];

const debates=[
  {id:"debate-ai-writing",type:"토론논제",level:"중등·고등",title:"AI가 쓴 글도 ‘나의 글’이라고 할 수 있을까?",summary:"도구의 도움과 저자의 책임, 창작의 기준을 토론합니다.",points:["AI는 문장을 만들 수 있지만 주제와 방향을 선택하는 것은 사용자라는 관점","표현 자체를 생성한 주체가 다르면 저자성도 달라져야 한다는 관점","수정·선택·검증에 어느 정도 참여했는지가 핵심이라는 절충적 관점"],questions:["저자를 판단하는 가장 중요한 기준은 무엇인가?","도구의 도움은 어느 지점부터 공동 창작이 되는가?","학교 과제에서 AI 사용 범위는 어떻게 정해야 할까?"]},
  {id:"debate-schoolphone",type:"토론논제",level:"초등·중등",title:"학교에서 스마트폰 사용을 제한해야 할까?",summary:"학습권, 자율성, 안전과 소통을 함께 고려하는 논제.",points:["집중력과 수업권 보호를 위해 제한이 필요하다는 관점","학생의 자율적 사용 능력을 길러야 한다는 관점","시간·공간·목적에 따라 제한 범위를 달리해야 한다는 관점"],questions:["학교가 개인 기기 사용을 제한할 수 있는 근거는 무엇인가?","금지와 교육 중 어느 방식이 장기적으로 효과적일까?","예외를 인정해야 하는 상황은 무엇일까?"]},
  {id:"debate-uniform",type:"토론논제",level:"중등",title:"교복은 학생의 자유를 지나치게 제한할까?",summary:"개인 표현의 자유와 학교 공동체의 규칙을 비교합니다.",points:["복장 선택은 개인의 표현 자유라는 관점","교복은 경제적 비교와 복장 경쟁을 줄일 수 있다는 관점","획일적 규정보다 선택권을 넓히는 방식이 가능하다는 관점"],questions:["학교 공동체가 학생의 복장을 정할 수 있는 범위는 어디까지인가?","교복이 실제로 평등을 높이는가?","자유와 공동체 규칙이 충돌할 때 어떤 기준이 필요한가?"]},
  {id:"debate-animal",type:"토론논제",level:"초등·중등",title:"동물원은 계속 필요할까?",summary:"교육·보전의 가치와 동물 복지 문제를 함께 살펴봅니다.",points:["멸종위기종 보전과 교육에 기여한다는 관점","동물의 자연스러운 삶을 제한한다는 관점","전통적 동물원보다 보호·복원 중심으로 바뀌어야 한다는 관점"],questions:["동물원의 가장 중요한 목적은 무엇이어야 할까?","교육 목적이 동물의 자유 제한을 정당화할 수 있을까?","좋은 동물원을 판단하는 기준을 만들어 보자."]}
];

const writing=[
  {id:"writing-claim",type:"논술쓰기",level:"전체",title:"좋은 주장은 어떻게 만드는가",summary:"넓고 막연한 생각을 논술 가능한 주장으로 바꾸는 방법.",body:["좋은 주장은 단순한 감상이나 사실 확인이 아니라, 다른 사람이 동의하거나 반박할 수 있는 판단 문장이다.","‘환경이 중요하다’보다 ‘학교는 일회용품 사용을 줄이기 위해 다회용 식기 사용을 의무화해야 한다’가 논술하기 좋은 주장에 가깝다. 대상과 행동, 기준이 더 분명하기 때문이다.","주장을 만들 때는 ‘누가, 무엇을, 왜 해야 하는가’를 점검하면 문장이 훨씬 선명해진다."],questions:["내 주장이 사실 설명인지 판단인지 구분해 보자.","대상과 행동이 분명한가?","근거로 설명할 수 있는 범위인가?"]},
  {id:"writing-evidence",type:"논술쓰기",level:"전체",title:"근거를 길게 쓰는 것이 좋은 글일까",summary:"근거의 양보다 주장과의 연결이 더 중요한 이유.",body:["근거가 많다고 해서 글이 자동으로 설득력 있어지는 것은 아니다. 중요한 것은 그 근거가 왜 주장을 뒷받침하는지 설명하는 것이다.","사례를 제시한 뒤 ‘이 사례는 무엇을 보여 주는가’를 한 문장으로 해석하면 근거와 주장의 연결이 선명해진다.","논술에서는 사실 → 의미 → 주장 순서로 연결하는 연습이 효과적이다."],questions:["근거 뒤에 해석 문장이 있는가?","이 근거가 다른 주장에도 똑같이 쓰일 수 있는 너무 일반적인 내용은 아닌가?","반대 입장의 사람이 이 근거를 어떻게 비판할지 생각해 보자."]},
  {id:"writing-paragraph",type:"논술쓰기",level:"중등·고등",title:"한 문단에는 한 가지 역할만",summary:"문단의 역할을 분명하게 나누면 글의 논리가 선명해집니다.",body:["한 문단 안에 주장, 새로운 근거, 반론, 결론이 모두 섞이면 독자는 글의 구조를 따라가기 어렵다.","각 문단에 ‘주장 제시’, ‘근거 설명’, ‘반론 검토’, ‘결론’처럼 하나의 중심 역할을 부여하면 글이 안정된다.","문단 첫 문장을 읽었을 때 그 문단이 무엇을 하려는지 알 수 있는지 확인해 보는 것이 좋은 퇴고 방법이다."],questions:["각 문단의 역할을 한 단어로 붙여 보자.","서로 다른 역할이 한 문단에 섞인 곳은 없는가?","문단 순서를 바꾸어도 되는지 점검해 보자."]},
  {id:"writing-counter",type:"논술쓰기",level:"고등",title:"반론을 쓰면 왜 글이 더 강해질까",summary:"상대 입장을 공정하게 검토하는 것이 설득력을 높이는 이유.",body:["반론은 자신의 주장을 약하게 만드는 요소가 아니다. 오히려 예상 가능한 비판을 먼저 검토함으로써 주장의 한계를 알고 있다는 신뢰를 준다.","좋은 반론 처리는 상대의 주장을 과장해서 공격하지 않는다. 실제로 설득력 있는 반대 근거를 인정한 뒤, 자신의 기준에서 왜 여전히 다른 결론이 타당한지 설명한다.","‘물론 A라는 문제가 있다. 그러나 B라는 기준에서 볼 때…’와 같은 구조는 반론과 재반론을 명확하게 연결하는 데 도움이 된다."],questions:["내 주장에 대한 가장 강한 반론은 무엇인가?","그 반론에서 인정해야 할 부분은 무엇인가?","어떤 기준을 제시하면 다시 내 주장으로 돌아올 수 있을까?"]}
];

const guides=[
  {id:"guide-parent",type:"교육가이드",audience:"학부모",title:"아이에게 책을 읽고 무엇을 물어봐야 할까",summary:"‘재미있었어?’에서 한 단계 더 나아가는 독서 질문법.",body:["책을 다 읽은 뒤 줄거리를 시험하듯 묻기보다, 아이가 자신의 판단을 설명하게 하는 질문이 좋다.","‘가장 이해되지 않았던 인물의 선택은 무엇이었어?’, ‘네가 그 상황이라면 무엇을 다르게 했을까?’처럼 이유를 묻는 질문은 사고를 확장한다.","정답을 바로 알려주기보다 아이가 근거를 찾도록 기다리는 것이 중요하다. 독서논술에서 질문은 평가 도구가 아니라 생각을 꺼내는 도구다."],questions:["사실 확인 질문 1개와 생각 질문 1개를 만들어 보자.","아이의 대답을 바로 평가하지 않고 이어서 물을 수 있는 질문은 무엇일까?"]},
  {id:"guide-teacher",type:"교육가이드",audience:"교사",title:"토론 수업에서 찬반을 너무 빨리 나누지 않는 이유",summary:"입장 선택 전 쟁점과 판단 기준을 먼저 찾는 수업 설계.",body:["토론 수업을 시작하자마자 찬반을 나누면 학생은 자신의 입장을 방어하는 데 집중하기 쉽다.","먼저 ‘무엇이 충돌하고 있는가’, ‘누구의 이익이 영향을 받는가’, ‘판단 기준은 무엇인가’를 찾게 하면 같은 논제를 더 입체적으로 볼 수 있다.","쟁점 정리 → 기준 설정 → 자료 검토 → 입장 선택의 순서로 진행하면 토론이 단순한 말싸움이 아니라 판단 훈련이 된다."],questions:["이 논제에서 충돌하는 가치 두 가지는 무엇인가?","입장을 정하기 전에 꼭 확인해야 할 사실은 무엇인가?"]},
  {id:"guide-bookchoice",type:"교육가이드",audience:"학부모·교사",title:"학년보다 중요한 책 선정 기준 4가지",summary:"난이도만 보지 않고 좋은 독서논술 책을 고르는 방법.",body:["독서논술용 책은 반드시 어렵거나 유명할 필요가 없다. 중요한 것은 학생이 질문을 만들 수 있는 책인가이다.","첫째, 인물이나 사회의 선택이 분명해야 한다. 둘째, 하나의 정답으로 끝나지 않는 문제가 있어야 한다. 셋째, 학생의 경험과 연결할 수 있어야 한다. 넷째, 다른 자료와 확장해 읽을 수 있어야 한다.","읽기 수준은 학생에게 맞추되 질문의 깊이는 충분히 높일 수 있다. 쉬운 책도 좋은 질문과 만나면 깊은 논술 수업이 된다."],questions:["지금 읽는 책에 선택의 갈등이 있는가?","학생의 경험과 연결할 수 있는 장면이 있는가?","관련 사회 문제나 다른 책으로 확장할 수 있는가?"]},
  {id:"guide-vocab",type:"교육가이드",audience:"학생",title:"어휘 공부를 사전 뜻 암기로 끝내지 않는 법",summary:"단어의 의미를 문맥과 판단에 연결하는 방법.",body:["어휘를 많이 아는 것은 읽기에 도움이 되지만 사전적 정의만 암기하면 실제 글에서 뜻을 유연하게 적용하기 어렵다.","새 단어를 배울 때는 비슷한 말, 반대말, 자주 함께 쓰이는 표현, 실제 문장까지 함께 보아야 한다.","특히 논술 어휘는 그 단어가 어떤 판단 기준을 담고 있는지 살펴보면 좋다. ‘공정하다’, ‘효율적이다’, ‘정당하다’ 같은 말은 단순한 뜻보다 어떤 기준에서 그렇게 말하는지가 중요하다."],questions:["오늘 배운 단어를 자기 문장으로 써 보자.","같은 단어가 다른 문맥에서 어떻게 달라지는지 비교해 보자."]}
];

const contentPaths={
  "book-animalfarm": "/munhaeryeokplus/books/animal-farm/",
  "book-demian": "/munhaeryeokplus/books/demian/",
  "book-littleprince": "/munhaeryeokplus/books/little-prince/",
  "book-justice": "/munhaeryeokplus/books/justice/",
  "book-sapiens": "/munhaeryeokplus/books/sapiens/",
  "book-giver": "/munhaeryeokplus/books/the-giver/",
  "book-fahrenheit": "/munhaeryeokplus/books/fahrenheit-451/",
  "book-wonder": "/munhaeryeokplus/books/wonder/",
  "topic-critical-reading": "/munhaeryeokplus/topics/critical-reading/",
  "topic-filterbubble": "/munhaeryeokplus/topics/filter-bubble/",
  "topic-choice": "/munhaeryeokplus/topics/choice-and-happiness/",
  "topic-ai-literacy": "/munhaeryeokplus/topics/ai-literacy/",
  "topic-fairness": "/munhaeryeokplus/topics/fairness/",
  "topic-media": "/munhaeryeokplus/topics/news-headlines/",
  "debate-ai-writing": "/munhaeryeokplus/debate/ai-writing/",
  "debate-schoolphone": "/munhaeryeokplus/debate/school-smartphone/",
  "debate-uniform": "/munhaeryeokplus/debate/school-uniform/",
  "debate-animal": "/munhaeryeokplus/debate/zoo/",
  "writing-claim": "/munhaeryeokplus/writing/good-claim/",
  "writing-evidence": "/munhaeryeokplus/writing/evidence/",
  "writing-paragraph": "/munhaeryeokplus/writing/paragraph/",
  "writing-counter": "/munhaeryeokplus/writing/counterargument/",
  "guide-parent": "/munhaeryeokplus/guides/reading-questions/",
  "guide-teacher": "/munhaeryeokplus/guides/debate-class/",
  "guide-bookchoice": "/munhaeryeokplus/guides/book-selection/",
  "guide-vocab": "/munhaeryeokplus/guides/vocabulary-study/"
};
function contentUrl(id){return contentPaths[id]||"/munhaeryeokplus/"}

const allSearch=[...books.map(x=>({...x,type:"추천도서"})),...topics,...debates,...writing,...guides];
let currentRoute="home",previousRoute="home",bookLevel="전체",topicCategory="전체";

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function route(name){
  previousRoute=currentRoute==="detail"?previousRoute:currentRoute;
  currentRoute=name;
  $$(".page").forEach(p=>p.classList.remove("active"));
  $("#page-"+name)?.classList.add("active");
  $$(".nav-link").forEach(n=>n.classList.toggle("active",n.dataset.route===name));
  if(name==="books")renderBooks();
  if(name==="topics")renderTopics();
  if(name==="debate")renderDebates();
  if(name==="writing")renderWriting();
  if(name==="guides")renderGuides();
  window.scrollTo({top:0,behavior:"smooth"});
}
function bindRoutes(){
  $$("[data-route]").forEach(el=>el.onclick=()=>route(el.dataset.route));
  $$("[data-filter-level]").forEach(el=>el.onclick=()=>{bookLevel=el.dataset.filterLevel;route("books")});
}
function cardHtml(item){
  return `<article class="content-card"><span class="card-kicker">${item.type||item.category}</span><h3>${item.title}</h3><p>${item.summary||item.desc}</p><div class="meta-row"><span class="tag">${item.level||item.audience||""}</span>${item.category?'<span class="tag">'+item.category+'</span>':""}</div><a class="text-link" href="${contentUrl(item.id)}">읽어보기 →</a></article>`;
}
function renderFeatured(){
  $("#featuredContent").innerHTML=[topics[3],debates[0],writing[0]].map(cardHtml).join("");
  bindContent();
}
function renderBooks(){
  $("#bookLevelFilters").innerHTML=["전체","초등","중등","고등"].map(x=>`<button class="chip ${bookLevel===x?"active":""}" data-book-level="${x}">${x}</button>`).join("");
  const q=($("#bookSearch")?.value||"").trim().toLowerCase();
  const arr=books.filter(b=>(bookLevel==="전체"||b.level===bookLevel)&&(!q||(b.title+" "+b.author+" "+b.category).toLowerCase().includes(q)));
  $("#bookGrid").innerHTML=arr.length?arr.map(b=>`<article class="book-card"><div class="book-cover">${b.title}</div><span class="card-kicker">${b.level} · ${b.category}</span><h3>${b.title}</h3><p>${b.author} · ${b.desc}</p><a class="text-link" href="${contentUrl(b.id)}">독서 질문 보기 →</a></article>`).join(""):'<div class="empty-state">조건에 맞는 책이 없습니다.</div>';
  $$("[data-book-level]").forEach(x=>x.onclick=()=>{bookLevel=x.dataset.bookLevel;renderBooks()});
  $("#bookSearch").oninput=renderBooks;bindContent();
}
function renderTopics(){
  const cats=["전체",...new Set(topics.map(x=>x.category))];
  $("#topicTabs").innerHTML=cats.map(c=>`<button class="chip ${topicCategory===c?"active":""}" data-topic-cat="${c}">${c}</button>`).join("");
  const arr=topicCategory==="전체"?topics:topics.filter(x=>x.category===topicCategory);
  $("#topicGrid").innerHTML=arr.map(cardHtml).join("");
  $$("[data-topic-cat]").forEach(x=>x.onclick=()=>{topicCategory=x.dataset.topicCat;renderTopics()});bindContent();
}
function renderDebates(){
  $("#debateGrid").innerHTML=debates.map((d,i)=>`<article class="debate-card"><div class="debate-no">${String(i+1).padStart(2,"0")}</div><div><span class="card-kicker">${d.level}</span><h3>${d.title}</h3><p>${d.summary}</p></div><a class="btn ghost" href="${contentUrl(d.id)}">쟁점 보기</a></article>`).join("");bindContent();
}
function renderWriting(){$("#writingGrid").innerHTML=writing.map(cardHtml).join("");bindContent()}
function renderGuides(){$("#guideGrid").innerHTML=guides.map(g=>`<article class="guide-card"><span class="card-kicker">${g.audience}</span><h3>${g.title}</h3><p>${g.summary}</p><a class="text-link" href="${contentUrl(g.id)}">자세히 보기 →</a></article>`).join("");bindContent()}
function findItem(id){return allSearch.find(x=>x.id===id)}
function openDetail(id){
  const item=findItem(id);if(!item)return;
  previousRoute=currentRoute==="detail"?previousRoute:currentRoute;currentRoute="detail";
  $$(".page").forEach(p=>p.classList.remove("active"));$("#page-detail").classList.add("active");$$(".nav-link").forEach(n=>n.classList.remove("active"));
  const body=item.body||[];
  const points=item.points||[];
  const questions=item.questions||[];
  $("#detailArticle").innerHTML=`<header class="detail-hero"><span class="eyebrow">${item.type||"추천도서"}</span><h1>${item.title}</h1><p class="detail-summary">${item.summary||item.desc}</p><div class="meta-row">${item.author?'<span class="tag">'+item.author+'</span>':""}${item.level?'<span class="tag">'+item.level+'</span>':""}${item.category?'<span class="tag">'+item.category+'</span>':""}</div></header>
  <div class="article-body">
    ${item.author?'<h2>이 책으로 무엇을 생각할까</h2><p>'+item.desc+'</p>':""}
    ${body.map(p=>'<p>'+p+'</p>').join("")}
    ${points.length?'<h2>토론의 핵심 쟁점</h2><ul>'+points.map(p=>'<li>'+p+'</li>').join("")+'</ul>':""}
    ${questions.length?'<div class="question-box"><h3>생각해 볼 질문</h3><ol>'+questions.map(q=>'<li>'+q+'</li>').join("")+'</ol></div>':""}
  </div>`;
  window.scrollTo({top:0,behavior:"smooth"});
}
function bindContent(){}
function openSearch(){$("#searchOverlay").classList.add("open");$("#searchOverlay").setAttribute("aria-hidden","false");$("#globalSearch").value="";$("#searchResults").innerHTML='<div class="empty-state">책 제목, 개념, 논제, 글쓰기 방법을 검색해 보세요.</div>';setTimeout(()=>$("#globalSearch").focus(),50)}
function closeSearch(){$("#searchOverlay").classList.remove("open");$("#searchOverlay").setAttribute("aria-hidden","true")}
function runSearch(){
  const q=$("#globalSearch").value.trim().toLowerCase();
  if(!q){$("#searchResults").innerHTML='<div class="empty-state">검색어를 입력해 주세요.</div>';return}
  const arr=allSearch.filter(x=>JSON.stringify(x).toLowerCase().includes(q)).slice(0,12);
  $("#searchResults").innerHTML=arr.length?arr.map(x=>`<a class="search-result" href="${contentUrl(x.id)}"><span>${x.type||"추천도서"}</span><b>${x.title}</b><small>${x.summary||x.desc||""}</small></div>`).join(""):'<div class="empty-state">검색 결과가 없습니다.</div>';
  bindContent();
}
$("#openSearch").onclick=openSearch;$("#closeSearch").onclick=closeSearch;$("#globalSearch").oninput=runSearch;$("#searchOverlay").onclick=e=>{if(e.target.id==="searchOverlay")closeSearch()};
$("#detailBack").onclick=()=>route(previousRoute||"home");
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSearch()});
bindRoutes();renderFeatured();renderBooks();renderTopics();renderDebates();renderWriting();renderGuides();bindContent();
