import { useEffect, useState } from 'react';
import { Listbox, Combobox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { CircleDashed, Plus, ArrowRightLeft, ThumbsUp } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

import ALL_RUNE_LIBRARY from '@/data/ALL_RUNE_LIBRARY.json';
import PRESET_RUNES from '@/data/PRESET_RUNES.json';

type GearType = keyof typeof GEAR_SLOTS; // 'weapon' | 'armor' | 'accessory' | 'emblem'
type Grade = '전설' | '에픽' | '엘리트';

interface Gear {
  type: GearType;
  index: number;
  currentRune: {
    name: string;
    grade: Grade;
  };
}

interface Job {
  name: string;
  gears: Gear[];
}

interface Character {
  id: string;
  name: string;
  jobs: Job[];
}

interface SelectedJob {
  charId: string;
  jobName: string;
}

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

const renderStars = (tier) => '★'.repeat(4 - tier);

export default function GearTracker() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<SelectedJob>({ charId: '', jobName: '' });
  const [newJob, setNewJob] = useState<string>('');
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

  const addJob = (charId: string) => {
    if (!newJob) return;
  
    const gears: Gear[] = Object.entries(GEAR_SLOTS).flatMap(([type, count]) =>
      Array.from({ length: count }, (_, i) => ({
        type: type as GearType,
        index: i + 1,
        currentRune: { name: '', grade: '엘리트' as Grade },
      }))
    );
  
    const updated = characters.map(c =>
      c.id === charId
        ? {
            ...c,
            jobs: [...c.jobs, { name: newJob, gears }]
          }
        : c
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
  
    let total = 0;
    let done = 0;
    let upgradable = 0;
  
    Object.entries(GEAR_SLOTS).forEach(([type, count]) => {
      const slots = typeMap[type] || [];
      const validRunes = PRESET_RUNES[job.name]?.[type] ?? [];
  
      const runeMap = validRunes.reduce((acc, runePreset) => {
        Object.entries(runePreset.runes).forEach(([runeName, grade]) => {
          acc[runeName] = grade;
        });
        return acc;
      }, {} as Record<string, string>);
  
      const used = new Set();
      let matched = 0;
  
      slots.forEach(g => {
        const currentName = g.currentRune?.name?.trim();
  
        if (!currentName || !runeMap[currentName]) return;
  
        const matchedGrade = runeMap[currentName];
        const isMatched = Boolean(matchedGrade);
        const isLegendary = matchedGrade === '전설';
  
        // 같은 계열 전설 룬이 존재하는지 확인
        const hasLegendaryAlt = Object.entries(runeMap).some(
          ([name, grade]) => name.includes(currentName) && grade === '전설'
        );
  
        const isUpgradeable = isMatched && !isLegendary && hasLegendaryAlt;
  
        if (isMatched && !used.has(currentName)) {
          matched++;
          used.add(currentName);
        }
  
        if (isUpgradeable) {
          upgradable++;
        }
      });
  
      total += count;
      done += Math.min(count, matched);
    });
  
    return `${done} / ${total} 부위 완료` + (upgradable > 0 ? ` (업그레이드 가능: ${upgradable})` : '');
  };

  const selectedJob = characters.find(c => c.id === selected.charId)?.jobs.find(j => j.name === selected.jobName);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">장비 목표 관리</h1>
      <button onClick={addCharacter} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">+ 캐릭터 추가</button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {characters.map(char => (
          <div key={char.id} className="border rounded-lg p-4 shadow">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">{char.name}</h2>
              <div className="space-x-2">
                <button onClick={() => renameCharacter(char.id)} className="text-sm text-blue-600">✏️</button>
                <button onClick={() => deleteCharacter(char.id)} className="text-sm text-red-600">🗑</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full">
                <Listbox value={newJob} onChange={setNewJob}>
                  <ListboxButton className=" border p-2 rounded w-full mb-2">
                    {newJob || "직업 선택"}
                  </ListboxButton>
                  <ListboxOptions className=" border rounded shadow bg-white w-full mb-2">
                    {jobOptions.map(job => (
                      <ListboxOption key={job} value={job} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                        {job}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Listbox>
              </div>
              <div className="text-sm text-white select-none">🗑</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => addJob(char.id)} className="bg-blue-600 text-white px-4 py-2 rounded w-full gap-2">+ 직업 추가</button>
              <div className="text-sm text-white select-none">🗑</div>
            </div>
            <div className="space-y-2 mt-4">
              {char.jobs.map(job => (
                <div key={job.name} className="flex items-center gap-2">
                  <button onClick={() => selectJob(char.id, job.name)} className={`flex-1 text-left px-4 py-2 rounded ${selected.charId === char.id && selected.jobName === job.name ? 'border border-blue-500' : 'border border-gray-100'}`}>
                    {job.name} ({getProgress(job)})
                  </button>
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
        <div>
          {
            <GearProgressIcon type='weapon' selectedJob={selectedJob}/>
          }
        </div>
        <p className="text-sm text-gray-600 mb-2">
          목표 룬: {PRESET_RUNES[selectedJob.name]?.weapon
            .slice()
            .sort((a,b) => a.presetTier - b.presetTier)
            .map(r => `${r.displayName}(${renderStars(r.presetTier)})`)
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
        <div>
          {
            <GearProgressIcon type='accessory' selectedJob={selectedJob}/>
          }
        </div>
        <p className="text-sm text-gray-600 mb-2">
          목표 룬: {PRESET_RUNES[selectedJob.name]?.accessory
            .slice()
            .sort((a,b) => a.presetTier - b.presetTier)
            .map(r => `${r.displayName}(${renderStars(r.presetTier)})`)
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
        <div>
          {
            <GearProgressIcon type='emblem' selectedJob={selectedJob}/>
          }
        </div>
        <p className="text-sm text-gray-600 mb-2">
          목표 룬: {PRESET_RUNES[selectedJob.name]?.emblem
            .slice()
            .sort((a,b) => a.presetTier - b.presetTier)
            .map(r => `${r.displayName}(${renderStars(r.presetTier)})`)
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
        <div>
          {
            <GearProgressIcon type='armor' selectedJob={selectedJob}/>
          }
        </div>
        <p className="text-sm text-gray-600 mb-2">
          목표 룬: {PRESET_RUNES[selectedJob.name]?.armor
            .slice()
            .sort((a,b) => a.presetTier - b.presetTier)
            .map(r => `${r.displayName}(${renderStars(r.presetTier)})`)
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

  // 룬 프리셋을 평탄화하여 이름과 등급을 맵으로
  const runeMap = jobPreset.reduce((acc, preset) => {
    Object.entries(preset.runes).forEach(([runeName, grade]) => {
      acc[runeName] = grade;
    });
    return acc;
  }, {} as Record<string, string>);

  const currentName = gear.currentRune?.name?.trim();
  const currentGrade = gear.currentRune?.grade;
  const matchedGrade = runeMap[currentName];

  const isMatched = Boolean(matchedGrade);
  const isLegendary = currentGrade === '전설';
  const isEpic = currentGrade === '에픽';

  const hasLegendaryAlt = Object.entries(runeMap).some(
    ([name, grade]) =>
      name.includes(currentName) && grade === '전설' && name !== currentName
  );

  const isUpgradeable = isMatched && !isLegendary && hasLegendaryAlt;

  const borderColor = isMatched
    ? isLegendary
      ? 'border-yellow-500'
      : isEpic
        ? 'border-pink-500'
        : 'border-purple-500'
    : 'border-gray-400';

  return (
    <div
      className={`border-2 ${borderColor} rounded-xl p-4 shadow flex flex-col gap-2`}
      title={
        isUpgradeable
          ? '업그레이드 가능한 룬입니다.'
          : isMatched
            ? '프리셋에 포함된 룬입니다.'
            : '프리셋 외 룬입니다.'
      }
    >
      <Combobox
        value={gear.currentRune.name}
        onChange={(val) =>
          updateGearFn(idx, {
            ...gear.currentRune,
            name: val,
            grade: allRunes[val] || '엘리트',
          })
        }
      >
        <div className="relative">
          <Combobox.Input
            className="border p-2 rounded w-full"
            displayValue={(name: string) => name}
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
function GearProgressIcon({ type, selectedJob }) {
  const gears = selectedJob.gears.filter(g => g.type === type);
  const validRunes = PRESET_RUNES[selectedJob.name]?.[type] ?? [];

  // 룬과 티어 정보를 매핑 (runes: 룬 이름 -> 등급, presetTier: 프리셋 티어)
  const presetMap = validRunes.reduce((acc, preset) => {
    Object.entries(preset.runes).forEach(([runeName]) => {
      // 실제 등급은 ALL_RUNE_LIBRARY에서 가져옴
      const realGrade = ALL_RUNE_LIBRARY[type]?.[runeName];
      if (realGrade) {
        acc[runeName] = { grade: realGrade, presetTier: preset.presetTier };
      }
    });
    return acc;
  }, {} as Record<string, { grade: string, presetTier: number }>);

  const label = {
    weapon: '무기',
    armor: '방어구',
    accessory: '장신구',
    emblem: '엠블럼',
  }[type];

  return (
    <div className="flex gap-2 items-center" key={label}>
      <div className="text-xl font-semibold">{label}</div>
      <Tooltip.Provider delayDuration={100}>
        {gears.map((g, i) => {
          const runeName = g.currentRune?.name?.trim();
          const runeGrade = g.currentRune?.grade;
          const preset = presetMap[runeName];

          let icon = <CircleDashed className="w-6 h-6 text-gray-400"/>;
          let tooltipText = '추천되지 않은 룬';
          let color = 'bg-gray-200';

          if (preset) {
            const { presetTier } = preset;

            if (presetTier === 1) {
              if (runeGrade === '전설') {
                icon = <ThumbsUp className="w-4 h-4 text-white mb-0.5"/>;
                color = 'bg-teal-500';
                tooltipText = `✔ ${runeName}: 추천 룬 + 전설 등급 + 티어 충족`;
              } else {
                icon = <Plus className="w-5 h-5 text-white"/>;
                color = 'bg-orange-400';
                tooltipText = `⬆ ${runeName}: 추천 룬이지만 전설 아님`;
              }
            } else {
              icon = <ArrowRightLeft className="w-4 h-4 text-white"/>;
              color = 'bg-yellow-400';
              tooltipText = `	↔ ${runeName}: 추천 룬이지만 티어가 낮음`;
            }
          }

          return (
            <Tooltip.Root key={i}>
              <Tooltip.Trigger asChild>
                <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center`}>
                  {icon}
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content
                side="top"
                className="bg-black text-white px-2 py-1 text-xs rounded shadow-md z-50"
              >
                {tooltipText}
                <Tooltip.Arrow className="fill-black" />
              </Tooltip.Content>
            </Tooltip.Root>
          );
        })}
      </Tooltip.Provider>
    </div>
  );
}