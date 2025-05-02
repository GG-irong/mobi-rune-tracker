import { useEffect, useState } from 'react';
import { Listbox, Combobox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';

const GEAR_SLOTS = {
  weapon: 1,
  armor: 5,
  accessory: 3,
  emblem: 1,
};

const GRADE_COLORS = {
  전설: 'text-yellow-500',
  에픽: 'text-pink-500',
  엘리트: 'text-[#8568a1]',
};

const ALL_RUNE_LIBRARY = {
  weapon: {
    '확산': '엘리트', '맹독': '엘리트', '선혈': '엘리트', '의식': '엘리트', '철': '엘리트',
    '삭풍': '엘리트', '대결': '엘리트', '전장': '엘리트',
    '전율': '에픽', '극독': '에픽', '강철': '에픽', '경이': '에픽', '질풍': '에픽',
    '결투': '에픽', '역병': '에픽', '격전': '에픽', '궁극': '에픽', '격노': '에픽',
    '선고': '에픽', '연격': '에픽', '혹한': '에픽', '고통': '에픽', '적혈': '에픽', '화염': '에픽',
    '냉혹한 겨울': '전설', '무수한 담금질': '전설', '살아있는 번갯불': '전설', '가시 덩굴': '전설', '타오르는 불씨': '전설',
    '차오르는 안개': '전설', '몰아치는 바람': '전설', '천 자루 검': '전설', '옛 검투사': '전설', '조화': '전설',
    '명암': '전설', '고뇌': '전설', '결투+': '전설', '질풍+': '전설', '경이+': '전설', '격전+': '전설',
    '역병+': '전설', '격노+': '전설', '파열': '전설', '눈 먼 분노': '전설', '영혼 수확자': '전설'
  },
  armor: {
    '격류': '엘리트', '기묘': '엘리트', '안심': '엘리트', '사활': '엘리트', '시작': '엘리트',
    '장벽': '엘리트', '경계': '엘리트', '수비': '엘리트', '사격': '엘리트', '폭주': '엘리트',
    '굶주림': '엘리트', '투쟁': '엘리트', '재활': '엘리트', '약화': '엘리트', '흡수': '엘리트', '극복': '엘리트',
    '폭풍': '에픽', '초자연': '에픽', '안정': '에픽', '초기': '에픽', '성채': '에픽',
    '방호': '에픽', '저격': '에픽', '발진': '에픽', '결핍': '에픽', '난투': '에픽',
    '생명': '에픽', '쇠약': '에픽', '얼어붙음': '에픽', '흡혈': '에픽', '격통': '에픽',
    '제물': '에픽', '침식': '에픽', '끈기': '에픽', '압도': '에픽', '절망': '에픽',
    '위협': '에픽', '전술가': '에픽', '기습': '에픽',
    '얼어붙은 불꽃-상의': '전설', '얼어붙은 불꽃-하의': '전설', '칼날 보루': '전설', '응축된 마력': '전설', '고요한 바람': '전설', '신성한 수양': '전설',
    '전율하는 악상': '전설', '비정한 승부사': '전설','거센 소나기': '전설', '붉은 맹약': '전설', '검은 서약': '전설', '생존 본능': '전설',
    '끝없는 활력': '전설', '원소술사': '전설', '극야': '전설', '깨달음': '전설', '횃불': '전설',
    '쇄빙': '전설', '반작용': '전설', '폭풍+': '전설', '흡혈+': '전설', '제물+': '전설',
    '침식+': '전설', '얼어붙음+': '전설', '격통+': '전설', '쇠약+': '전설', '안정+': '전설',
    '저격+': '전설', '방호+': '전설', '초기+': '전설', '초자연+': '전설', '생명+': '전설', 
    '성채+': '전설', '난투+': '전설', '검은 불길': '전설', '마나 격류': '전설', '연승': '전설', 
    '과충전': '전설', '독 안개': '전설', '바위 거인': '전설', '비열한 일격격': '전설'
  },
  accessory: {
    '참격': '엘리트', '돌진': '엘리트', '포효': '엘리트', '패기': '엘리트',
    '맹공': '에픽', '돌격': '에픽',
    '참격+': '전설', '돌진+': '전설', '포효+': '전설', '패기+': '전설', '맹공+': '전설', '돌격+': '전설',
    '압박': '엘리트', '무희': '엘리트', '맹렬': '엘리트', '피바람': '엘리트',
    '관통': '에픽', '낙화': '에픽',
    '관통+': '전설', '낙화+': '전설', '피바람+': '전설', '압박+': '전설', '무희+': '전설', '맹렬+': '전설',
    '회전': '엘리트', '분노': '엘리트', '회심': '엘리트', '절단': '엘리트',
    '반격': '에픽', '탄력': '에픽',
    '회전+': '전설', '분노+': '전설', '회심+': '전설', '절단+': '전설', '반격+': '전설', '탄력+': '전설',
    '몰아침': '엘리트', '날렵함': '엘리트', '탈출': '엘리트', '재빠름': '엘리트',
    '치명적': '에픽', '매': '에픽',
    '몰아침+': '전설', '날렵함+': '전설', '탈출+': '전설', '재빠른+': '전설', '치명적+': '전설', '매+': '전설',
    '감전': '엘리트', '방해': '엘리트', '전류': '엘리트', '반전': '엘리트',
    '화약': '에픽', '연쇄': '에픽',
    '감전+': '전설', '방해+': '전설', '전류+': '전설', '반전+': '전설', '화약+': '전설', '연쇄+': '전설',
    '파쇄': '엘리트', '끈질김': '엘리트', '무너짐': '엘리트', '내상': '엘리트',
    '초음파': '에픽', '집중': '에픽',
    '파쇄+': '전설', '끈질김+': '전설', '무너짐+': '전설', '내상+': '전설', '초음파+': '전설', '집중+': '전설',
    '낙뢰': '엘리트', '산사태': '엘리트', '증폭': '엘리트', '깜빡임': '엘리트',
    '운석': '에픽', '서리가시': '에픽',
    '낙뢰+': '전설', '산사태+': '전설', '깜빡임+': '전설', '증폭+': '전설', '운석+': '전설', '서리가시+': '전설',
    '북풍': '엘리트', '고드름': '엘리트', '겨울': '엘리트', '파편': '엘리트',
    '빙검': '에픽', '오로라': '에픽',
    '북풍+': '전설', '고드름+': '전설', '겨울+': '전설', '파편+': '전설', '빙검+': '전설', '오로라+': '전설',
    '불기둥': '엘리트', '화력': '엘리트', '분출': '엘리트', '열풍': '엘리트',
    '불씨': '에픽', '잿더미': '에픽',
    '불기둥+': '전설', '화력+': '전설', '분출+': '전설', '열풍+': '전설', '불씨+': '전설', '잿더미+': '전설',
    '서약': '엘리트', '고동침': '엘리트', '감쌈': '엘리트', '물결': '엘리트',
    '억압': '에픽', '빛무리': '에픽',
    '서약+': '전설', '고동침+': '전설', '감쌈+': '전설', '물결+': '전설', '억압+': '전설', '빛무리+': '전설',
    '결속': '엘리트', '수레바퀴': '엘리트', '희생': '엘리트', '성전': '엘리트',
    '날개': '에픽', '빛줄기': '에픽',
    '결속+': '전설', '수레바퀴+': '전설', '희생+': '전설', '성전+': '전설', '날개+': '전설', '빛줄기+': '전설',
    '인과': '엘리트', '정화': '엘리트', '광휘': '엘리트', '축성': '엘리트',
    '응보': '에픽', '업화': '에픽',
    '인과+': '전설', '정화+': '전설', '광휘+': '전설', '축성+': '전설', '응보+': '전설', '업화+': '전설',
    '급습': '엘리트', '즉흥': '엘리트', '기만': '엘리트', '재치': '엘리트',
    '조롱': '에픽', '화음': '에픽',
    '급습+': '전설', '즉흥+': '전설', '기만+': '전설', '재치+': '전설', '조롱+': '전설', '화음+': '전설',
    '공명': '엘리트', '박애': '엘리트', '이중주': '엘리트', '속주': '엘리트',
    '흉성': '에픽', '종장': '에픽',
    '공명+': '전설', '박애+': '전설', '이중주+': '전설', '속주+': '전설', '흉성+': '전설', '종장+': '전설',
    '정열': '엘리트', '다가옴': '엘리트', '산뜻함': '엘리트', '간결함': '엘리트',
    '나비': '에픽', '갈채': '에픽',
    '정열+': '전설', '다가옴+': '전설', '산뜻함+': '전설', '간결함+': '전설', '나비+': '전설', '갈채+': '전설',
    '투척': '엘리트', '교활함': '엘리트', '치밀함': '엘리트', '독성': '엘리트',
    '독무': '에픽', '땅거미': '에픽',
    '투척+': '전설', '교활함+': '전설', '치밀함+': '전설', '독성+': '전설', '독무+': '전설', '땅거미+': '전설',
    '도약': '엘리트', '순발력': '엘리트', '열혈': '엘리트', '전진': '엘리트',
    '충돌': '에픽', '격파': '에픽',
    '도약+': '전설', '순발력+': '전설', '열혈+': '전설', '전진+': '전설', '충돌+': '전설', '격파+': '전설',
    '열상': '엘리트', '보름달': '엘리트', '속행': '엘리트', '강화': '엘리트',
    '회오리': '에픽', '질주': '에픽',
    '열상+': '전설', '보름달+': '전설', '속행+': '전설', '강화+': '전설', '회오리+': '전설', '질주+': '전설',
  },
  emblem: {
    '기민함': '엘리트', '강력함': '엘리트', '난폭함': '엘리트', '강인함': '엘리트',
    '날쌤': '에픽', '강렬함': '에픽', '광폭함': '에픽', '굳건함': '에픽',
    '굳건함+': '전설', '날쌤+': '전설', '강렬함+': '전설', '광폭함+': '전설', '현란함': '전설', '지혜로움': '전설', '냉혹함': '전설'
  }
};


const PRESET_RUNES = {
  석궁사수: {
    weapon: [
      { name: '눈 먼 분노', tier: 1 },
      { name: '천자루 검', tier: 1 },
      { name: '연격', tier: 2 }
    ],
    armor: [
      { name: '마나 격류', tier: 1 },
      { name: '바위 거인', tier: 1 },
      { name: '비열한 일격', tier: 1 },
      { name: '안정', tier: 2 },
      { name: '깨달음', tier: 2 },
      { name: '초기', tier: 2 },
      { name: '흡혈', tier: 2 }
    ],
    accessory: [
      { name: '연쇄', tier: 1 },
      { name: '반전', tier: 1 },
      { name: '감전', tier: 2 }
    ],
    emblem: [
      { name: '현란함', tier: 1 },
      { name: '냉혹함', tier: 2 },
      { name: '날쌤', tier: 2 }
    ],
  },


  도적: {
    weapon: [
      { name: '경이', tier: 1 }
    ],
    armor: [
      { name: '마나 격류', tier: 1 },
      { name: '바위 거인', tier: 1 },
      { name: '비열한 일격', tier: 1 },
      { name: '비정한 승부사', tier: 1 },
      { name: '흡혈', tier: 1 }
    ],
    accessory: [
      { name: '치밀함', tier: 1 },
      { name: '독무', tier: 2 },
      { name: '땅거미', tier: 2 },
      { name: '투척', tier: 3 }
    ],
    emblem: [
      { name: '지혜로움', tier: 1 },
      { name: '현란함', tier: 1 }
    ],
  },

  듀얼블레이드: {
    weapon: [
      { name: '눈 먼 분노', tier: 1 },
      { name: '무수한 담금질', tier: 2 },
      { name: '천자루 검', tier: 2 },
      { name: '경이', tier: 2 }
    ],
    armor: [
      { name: '마나 격류', tier: 1 },
      { name: '바위 거인', tier: 1 },
      { name: '초기', tier: 3 },
      { name: '안정', tier: 3 },
      { name: '흡혈', tier: 3 },
      { name: '폭풍', tier: 3 }
    ],
    accessory: [
      { name: '질주', tier: 1 },
      { name: '열상', tier: 1 },
      { name: '속행', tier: 2 },
      { name: '보름달', tier: 2 }

    ],
    emblem: [
      { name: '현란함', tier: 1 },
      { name: '지혜로움', tier: 2 },
      { name: '날쌤', tier: 3 },
      { name: '강렬함', tier: 3 },
    ],
  },


  격투가: {
    weapon: [
      { name: '무수한 담금질', tier: 1 },
      { name: '천자루 검', tier: 1 },
      { name: '결투', tier: 1 },
      { name: '파열', tier: 2 }
    ],
    armor: [
      { name: '마나 격류', tier: 1 },
      { name: '바위 거인', tier: 1 },
      { name: '초기', tier: 2 },
      { name: '안정', tier: 2 },
      { name: '깨달음', tier: 2 },
      { name: '흡혈', tier: 2 },
      { name: '폭풍', tier: 2 },
      { name: '끝없는 활력', tier: 3 }
    ],
    accessory: [
      { name: '전진', tier: 1 },
      { name: '격파', tier: 1 },
      { name: '열혈', tier: 1 }
    ],
    emblem: [
      { name: '현란함', tier: 1 },
      { name: '강렬함', tier: 1 }
    ],
  },
};

const renderStars = (tier) => '★'.repeat(4 - tier);

export default function GearTracker() {
  const [characters, setCharacters] = useState([]);
  const [selected, setSelected] = useState({ charId: '', jobName: '' });
  const [newJob, setNewJob] = useState('');
  const jobOptions = Object.keys(PRESET_RUNES);

  useEffect(() => {
    const data = localStorage.getItem('gear-tracker-characters');
    if (data) setCharacters(JSON.parse(data));
  }, []);

  const saveToLocal = (data) => localStorage.setItem('gear-tracker-characters', JSON.stringify(data));

  const addCharacter = () => {
    if (characters.length >= 4) return;
    const newChar = {
      id: `char-${Date.now()}`,
      name: `캐릭터${characters.length + 1}`,
      jobs: [],
    };
    const updated = [...characters, newChar];
    setCharacters(updated);
    saveToLocal(updated);
  };

  const deleteCharacter = (charId) => {
    const updated = characters.filter(c => c.id !== charId);
    setCharacters(updated);
    saveToLocal(updated);
  };

  const renameCharacter = (charId) => {
    const name = prompt('새 캐릭터 이름:');
    if (!name) return;
    const updated = characters.map(c => c.id === charId ? { ...c, name } : c);
    setCharacters(updated);
    saveToLocal(updated);
  };

  const addJob = (charId) => {
    if (!newJob) return;
    const gears = Object.entries(GEAR_SLOTS).flatMap(([type, count]) =>
      Array.from({ length: count }, (_, i) => ({
        type,
        index: i + 1,
        currentRune: { name: '', grade: '엘리트' },
      }))
    );
    const updated = characters.map(c =>
      c.id === charId ? { ...c, jobs: [...c.jobs, { name: newJob, gears }] } : c
    );
    setCharacters(updated);
    saveToLocal(updated);
    setNewJob('');
  };

  const deleteJob = (charId, jobName) => {
    const updated = characters.map(c =>
      c.id === charId ? { ...c, jobs: c.jobs.filter(j => j.name !== jobName) } : c
    );
    setCharacters(updated);
    saveToLocal(updated);
    setSelected({ charId: '', jobName: '' });
  };

  const renameJob = (charId, jobName) => {
    const name = prompt('새 직업 이름:', jobName);
    if (!name) return;
    const updated = characters.map(c =>
      c.id === charId ? {
        ...c,
        jobs: c.jobs.map(j => j.name === jobName ? { ...j, name } : j),
      } : c
    );
    setCharacters(updated);
    saveToLocal(updated);
    setSelected(s => s.charId === charId && s.jobName === jobName ? { charId, jobName: name } : s);
  };

  const selectJob = (charId, jobName) => setSelected({ charId, jobName });

  const updateGear = (charId, jobName, index, newRune) => {
    const updated = characters.map(char => {
      if (char.id !== charId) return char;
      return {
        ...char,
        jobs: char.jobs.map(job => {
          if (job.name !== jobName) return job;
          const newGears = [...job.gears];
          newGears[index] = { ...newGears[index], currentRune: newRune };
          return { ...job, gears: newGears };
        }),
      };
    });
    setCharacters(updated);
    saveToLocal(updated);
  };

  const getProgress = (job) => {
    const typeMap = {};
    job.gears.forEach(g => {
      if (!typeMap[g.type]) typeMap[g.type] = [];
      typeMap[g.type].push(g);
    });
    let total = 0, done = 0;
    Object.entries(GEAR_SLOTS).forEach(([type, count]) => {
      const slots = typeMap[type] || [];
      const validRunes = PRESET_RUNES[job.name]?.[type] ?? [];
      const used = new Set();
      let matched = 0;
      slots.forEach(g => {
        const match = validRunes.find(r =>
          typeof g.currentRune?.name === 'string' &&
          r.name.trim() === g.currentRune.name.trim() &&
          !used.has(r.name)
        );
        if (match) {
          matched++;
          used.add(match.name);
        }
      });
      total += count;
      done += Math.min(count, matched);
    });
    return `${done} / ${total} 부위 완료`;
  };

  const selectedJob = characters.find(c => c.id === selected.charId)?.jobs.find(j => j.name === selected.jobName);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">장비 목표 관리</h1>
      <button onClick={addCharacter} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">+ 캐릭터 추가</button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {characters.map(char => (
          <div key={char.id} className="border rounded-lg p-4 shadow">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{char.name}</h2>
              <div className="space-x-2">
                <button onClick={() => renameCharacter(char.id)} className="text-sm text-blue-600">✏️</button>
                <button onClick={() => deleteCharacter(char.id)} className="text-sm text-red-600">🗑</button>
              </div>
            </div>
            <Listbox value={newJob} onChange={setNewJob}>
              <ListboxButton className="border p-2 rounded w-full mb-2">
                {newJob || "직업 선택"}
              </ListboxButton>
              <ListboxOptions className="border rounded shadow bg-white">
                {jobOptions.map(job => (
                  <ListboxOption key={job} value={job} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    {job}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
            <button onClick={() => addJob(char.id)} className="bg-blue-600 text-white px-4 py-2 rounded w-full">+ 직업 추가</button>
            <div className="space-y-2 mt-4">
              {char.jobs.map(job => (
                <div key={job.name} className="flex items-center gap-2">
                  <button onClick={() => selectJob(char.id, job.name)} className={`flex-1 text-left px-4 py-2 rounded ${selected.charId === char.id && selected.jobName === job.name ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                    {job.name} ({getProgress(job)})
                  </button>
                  <button onClick={() => renameJob(char.id, job.name)} className="text-sm text-blue-600">✏️</button>
                  <button onClick={() => deleteJob(char.id, job.name)} className="text-sm text-red-600">🗑</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
{selectedJob && (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">{selectedJob.name} 장비 상세</h2>

    <div className="space-y-6">

      {/* 무기 */}
      <div>
        
        {/* 유틸: 부위별 프로그레스바 */}
        {['weapon'].map((type) => {
          const gears = selectedJob.gears.filter(g => g.type === type);
          const validRunes = PRESET_RUNES[selectedJob.name]?.[type] ?? [];
          const used = new Set();
          gears.forEach(g => {
            const match = validRunes.find(r =>
              typeof g.currentRune?.name === 'string' &&
              r.name.trim() === g.currentRune.name.trim() &&
              !used.has(r.name)
            );
            if (match) {
              used.add(match.name);
            }
          });
          const label = {
            weapon: '무기',
            armor: '방어구',
            accessory: '장신구',
            emblem: '엠블럼',
          }[type];
          return (
            <div className="flex gap-2 items-center" key={label}>
              <div className="text-xl font-semibold">{label}</div>
              {gears.map((g, i) => {
                const match = validRunes.find(r => typeof g.currentRune?.name === 'string' && r.name.trim() === g.currentRune.name.trim());
                const isMatched = Boolean(match);
                const isLegendary = isMatched && g.currentRune.grade === '전설';
                const isUpgradeable = isMatched && g.currentRune.grade !== '전설';

                const color = isLegendary
                  ? 'bg-green-500'
                  : isUpgradeable
                    ? 'bg-yellow-400'
                    : 'bg-gray-300';

                return (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full ${color} border border-gray-400`}
                    title={g.currentRune.name || '미지정'}
                  />
                );
              })}
            </div>
          );
        })}
        <p className="text-sm text-gray-600 mb-2">
          목표 룬: {PRESET_RUNES[selectedJob.name]?.weapon
            .slice()
            .sort((a,b) => a.tier - b.tier)
            .map(r => `${r.name}(${renderStars(r.tier)})`)
            .join(' / ')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {selectedJob.gears.filter(g => g.type === 'weapon').map((gear) => (
            <GearSlot key={`weapon-${gear.index}`} gear={gear} idx={selectedJob.gears.indexOf(gear)} jobName={selectedJob.name} updateGearFn={(i, rune) => updateGear(selected.charId, selected.jobName, i, rune)} />
          ))}
        </div>
      </div>

      {/* 장신구 */}
      <div>
        {/* 유틸: 부위별 프로그레스바 */}
        {['accessory'].map((type) => {
          const gears = selectedJob.gears.filter(g => g.type === type);
          const validRunes = PRESET_RUNES[selectedJob.name]?.[type] ?? [];
          const used = new Set();
          gears.forEach(g => {
            const match = validRunes.find(r =>
              typeof g.currentRune?.name === 'string' &&
              r.name.trim() === g.currentRune.name.trim() &&
              !used.has(r.name)
            );
            if (match) {
              used.add(match.name);
            }
          });
          const label = {
            weapon: '무기',
            armor: '방어구',
            accessory: '장신구',
            emblem: '엠블럼',
          }[type];
          return (
            <div className="flex gap-2 items-center" key={label}>
              <div className="text-xl font-semibold">{label}</div>
              {gears.map((g, i) => {
                const match = validRunes.find(r => typeof g.currentRune?.name === 'string' && r.name.trim() === g.currentRune.name.trim());
                const isMatched = Boolean(match);
                const isLegendary = isMatched && g.currentRune.grade === '전설';
                const isUpgradeable = isMatched && g.currentRune.grade !== '전설';

                const color = isLegendary
                  ? 'bg-green-500'
                  : isUpgradeable
                    ? 'bg-yellow-400'
                    : 'bg-gray-300';

                return (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full ${color} border border-gray-400`}
                    title={g.currentRune.name || '미지정'}
                  />
                );
              })}
            </div>
          );
        })}
        <p className="text-sm text-gray-600 mb-2">
          목표 룬: {PRESET_RUNES[selectedJob.name]?.accessory
            .slice()
            .sort((a,b) => a.tier - b.tier)
            .map(r => `${r.name}(${renderStars(r.tier)})`)
            .join(' / ')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {selectedJob.gears.filter(g => g.type === 'accessory').map((gear) => (
            <GearSlot key={`accessory-${gear.index}`} gear={gear} idx={selectedJob.gears.indexOf(gear)} jobName={selectedJob.name} updateGearFn={(i, rune) => updateGear(selected.charId, selected.jobName, i, rune)} />
          ))}
        </div>
      </div>

      {/* 엠블럼 */}
      <div>
        {/* 유틸: 부위별 프로그레스바 */}
        {['emblem'].map((type) => {
          const gears = selectedJob.gears.filter(g => g.type === type);
          const validRunes = PRESET_RUNES[selectedJob.name]?.[type] ?? [];
          const used = new Set();
          gears.forEach(g => {
            const match = validRunes.find(r =>
              typeof g.currentRune?.name === 'string' &&
              r.name.trim() === g.currentRune.name.trim() &&
              !used.has(r.name)
            );
            if (match) {
              used.add(match.name);
            }
          });
          const label = {
            weapon: '무기',
            armor: '방어구',
            accessory: '장신구',
            emblem: '엠블럼',
          }[type];
          return (
            <div className="flex gap-2 items-center" key={label}>
              <div className="text-xl font-semibold">{label}</div>
              {gears.map((g, i) => {
                const match = validRunes.find(r => typeof g.currentRune?.name === 'string' && r.name.trim() === g.currentRune.name.trim());
                const isMatched = Boolean(match);
                const isLegendary = isMatched && g.currentRune.grade === '전설';
                const isUpgradeable = isMatched && g.currentRune.grade !== '전설';

                const color = isLegendary
                  ? 'bg-green-500'
                  : isUpgradeable
                    ? 'bg-yellow-400'
                    : 'bg-gray-300';

                return (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full ${color} border border-gray-400`}
                    title={g.currentRune.name || '미지정'}
                  />
                );
              })}
            </div>
          );
        })}
        <p className="text-sm text-gray-600 mb-2">
          목표 룬: {PRESET_RUNES[selectedJob.name]?.emblem
            .slice()
            .sort((a,b) => a.tier - b.tier)
            .map(r => `${r.name}(${renderStars(r.tier)})`)
            .join(' / ')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {selectedJob.gears.filter(g => g.type === 'emblem').map((gear) => (
            <GearSlot key={`emblem-${gear.index}`} gear={gear} idx={selectedJob.gears.indexOf(gear)} jobName={selectedJob.name} updateGearFn={(i, rune) => updateGear(selected.charId, selected.jobName, i, rune)} />
          ))}
        </div>
      </div>

      {/* 방어구 */}
      <div>
        {/* 유틸: 부위별 프로그레스바 */}
        {['armor'].map((type) => {
          const gears = selectedJob.gears.filter(g => g.type === type);
          const validRunes = PRESET_RUNES[selectedJob.name]?.[type] ?? [];
          const used = new Set();
          gears.forEach(g => {
            const match = validRunes.find(r =>
              typeof g.currentRune?.name === 'string' &&
              r.name.trim() === g.currentRune.name.trim() &&
              !used.has(r.name)
            );
            if (match) {
              used.add(match.name);
            }
          });
          const label = {
            weapon: '무기',
            armor: '방어구',
            accessory: '장신구',
            emblem: '엠블럼',
          }[type];
          return (
            <div className="flex gap-2 items-center" key={label}>
              <div className="text-xl font-semibold">{label}</div>
              {gears.map((g, i) => {
                const match = validRunes.find(r => typeof g.currentRune?.name === 'string' && r.name.trim() === g.currentRune.name.trim());
                const isMatched = Boolean(match);
                const isLegendary = isMatched && g.currentRune.grade === '전설';
                const isUpgradeable = isMatched && g.currentRune.grade !== '전설';

                const color = isLegendary
                  ? 'bg-green-500'
                  : isUpgradeable
                    ? 'bg-yellow-400'
                    : 'bg-gray-300';

                return (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full ${color} border border-gray-400`}
                    title={g.currentRune.name || '미지정'}
                  />
                );
              })}
            </div>
          );
        })}
        <p className="text-sm text-gray-600 mb-2">
          목표 룬: {PRESET_RUNES[selectedJob.name]?.armor
            .slice()
            .sort((a,b) => a.tier - b.tier)
            .map(r => `${r.name}(${renderStars(r.tier)})`)
            .join(' / ')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {selectedJob.gears.filter(g => g.type === 'armor').map((gear) => (
            <GearSlot key={`armor-${gear.index}`} gear={gear} idx={selectedJob.gears.indexOf(gear)} jobName={selectedJob.name} updateGearFn={(i, rune) => updateGear(selected.charId, selected.jobName, i, rune)} />
          ))}
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
function GearSlot({ gear, idx, jobName, updateGearFn }) {
  const [query, setQuery] = useState('');

  const allRunes = ALL_RUNE_LIBRARY[gear.type] || {};
  const filteredRunes = Object.keys(allRunes).filter(name => name.includes(query));

  const jobPreset = PRESET_RUNES[jobName]?.[gear.type] ?? [];
  const matched = typeof gear.currentRune?.name === 'string' &&
    jobPreset.some(preset => preset.name.trim() === gear.currentRune.name.trim());
  const borderColor = matched
    ? (gear.currentRune.grade === '전설' ? 'border-yellow-500' : gear.currentRune.grade === '에픽' ? 'border-pink-500' : 'border-[#8568a1]')
    : 'border-red-400';

  return (
    <div className={`border-2 ${borderColor} rounded-xl p-4 shadow flex flex-col gap-2`}>
      <Combobox
        value={gear.currentRune.name}
        onChange={(val) => updateGearFn(idx, { ...gear.currentRune, name: val, grade: allRunes[val] || '엘리트' })}
      >
        <div className="relative">
          <Combobox.Input
            className="border p-2 rounded w-full"
            displayValue={(name) => name}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="룬 이름 선택 또는 입력"
          />
          <Combobox.Options className="absolute z-10 w-full bg-white border mt-1 max-h-40 overflow-auto rounded shadow">
            {filteredRunes.map((rune) => {
              const runeGrade = allRunes[rune] || '엘리트';
              const colorClass = GRADE_COLORS[runeGrade] || '';
              return (
                <Combobox.Option
                  key={rune}
                  value={rune}
                  className={({ active }) => `cursor-pointer px-4 py-2 ${active ? 'bg-blue-100' : ''}`}
                >
                  <span className={colorClass}>{rune}</span>
                </Combobox.Option>
              );
            })}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}

