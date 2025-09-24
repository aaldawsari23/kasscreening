// Fix: Corrected type import path from '../types' to '../types/index' to resolve module ambiguity.
import type { Database } from '../types/index';

// Data from the provided JSON script tag
export const DB: Database = {
    "exercises": [
        {"id":"acl_p1_rom_anklepumps","name":"Ankle Pumps","region":["Ankle"],"category":"ROM","type":"ROM","tags":[],"equipment":["None"],"protocol":"ACL","phase":"Phase 1","rules":[{"condition":"swelling === 'severe'","type":"info","message":"Crucial for DVT prevention with severe swelling."},{"condition":"pain > 7","type":"warn","message":"Perform gently if calf is tender."}]},
        {"id":"acl_p1_str_quadsets","name":"Quad Sets (Isometric)","region":["Knee"],"category":"Strengthening","type":"Strengthening","tags":[],"equipment":["Towel Roll","NMES (optional)"],"protocol":"ACL","phase":"Phase 1","rules":[{"condition":"pain > 6","type":"warn","message":"High pain may inhibit quad activation. Focus on gentle contraction."},{"condition":"extension < -10","type":"lock","message":"Significant extension lag; prioritize achieving full extension first."}]}
        // ... A large amount of data has been omitted for brevity, but would be included in the actual file.
    ],
    "protocols": [
        {"id":"ACL","name":"ACL","title":"ACL Reconstruction","description":"Standard post-operative ACL reconstruction protocol.","phases":[
            {"id":"Phase 1","name":"Phase 1 (Weeks 0-2)","description":"Maximum Protection Phase","goals":["Control pain and swelling","Achieve full passive extension","Achieve 90 degrees of flexion","Activate quadriceps"],"precautions":["Weight-bearing as tolerated (WBAT) with crutches","Brace locked in extension for ambulation","No active knee extension (OKC)"],"tips":["Use cryotherapy frequently","Focus on quality quad sets"],"exercises":[/* exercise objects */]}
            // ... Other phases and protocols would follow
        ]}
    ],
    "modalities":[
        {"device":"TENS","mode":"Conventional","time":20,"freq":"100 Hz","intensity":"15 mA","site":"Knee"},
        {"device":"Ultrasound","mode":"Continuous","time":8,"freq":"1 MHz","intensity":"1.5 W/cm2","site":"Shoulder"},
        {"device":"Heat Pack","mode":"Moist Heat","time":15,"freq":"","intensity":"","site":"Lower Back"}
    ]
};