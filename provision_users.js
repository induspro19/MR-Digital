/**
 * provision_users.js - One-time script to create 13 seed users in Supabase
 * Usage: set SUPABASE_SERVICE_KEY=your_key && node provision_users.js
 * Get service key: Supabase Dashboard -> Settings -> API -> service_role
 */
const { createClient } = require('@supabase/supabase-js');

const URL = 'https://duikfskqbacackelieux.supabase.co';
const KEY  = process.env.SUPABASE_SERVICE_KEY || 'REPLACE_WITH_SERVICE_ROLE_KEY';

if (KEY === 'REPLACE_WITH_SERVICE_ROLE_KEY') {
    console.error('ERROR: Set SUPABASE_SERVICE_KEY environment variable first.');
    console.error('  Get it from: Supabase Dashboard -> Settings -> API -> service_role (secret)');
    process.exit(1);
}

const sb = createClient(URL, KEY, { auth: { autoRefreshToken: false, persistSession: false } });

const USERS = [
    { id:'admin',   email:'admin@indusfire.com',  pw:'admin123', name:'System Admin',     role:'admin',       dept:'Administration',  al:'ADMIN' },
    { id:'cre01',   email:'cre01@indusfire.com',  pw:'pass123',  name:'Arjun Mehta',      role:'creator',     dept:'Fire Suppression', al:'L1' },
    { id:'elec-l1', email:'elecl1@indusfire.com', pw:'pass123',  name:'Vikram Singh',     role:'creator',     dept:'Electrical',       al:'L1' },
    { id:'elec-l2', email:'elecl2@indusfire.com', pw:'pass123',  name:'Ahmed Shaikh',     role:'authorizer',  dept:'Electrical',       al:'L2' },
    { id:'mech-l1', email:'mechl1@indusfire.com', pw:'pass123',  name:'Ganesh Patil',     role:'creator',     dept:'Mechanical',       al:'L1' },
    { id:'mech-l2', email:'mechl2@indusfire.com', pw:'pass123',  name:'Sunil Rao',        role:'authorizer',  dept:'Mechanical',       al:'L2' },
    { id:'fire-l1', email:'firel1@indusfire.com', pw:'pass123',  name:'Pankaj Joshi',     role:'creator',     dept:'Fire Suppression', al:'L1' },
    { id:'fire-l2', email:'firel2@indusfire.com', pw:'pass123',  name:'Kavitha Nair',     role:'authorizer',  dept:'Fire Suppression', al:'L2' },
    { id:'auth01',  email:'auth01@indusfire.com', pw:'pass123',  name:'Priya Sharma',     role:'authorizer',  dept:'Administration',   al:'FINAL_AUTH' },
    { id:'plan01',  email:'plan01@indusfire.com', pw:'pass123',  name:'Ravi Nair',        role:'planner',     dept:'Technical Ops',    al:'PLANNING' },
    { id:'plan-l1', email:'planl1@indusfire.com', pw:'pass123',  name:'Kiran Patel',      role:'planner',     dept:'Technical Ops',    al:'PLANNING' },
    { id:'plan-l2', email:'planl2@indusfire.com', pw:'pass123',  name:'Neha Desai',       role:'planner',     dept:'Technical Ops',    al:'PLANNING' },
    { id:'proc01',  email:'proc01@indusfire.com', pw:'pass123',  name:'Suresh Iyer',      role:'procurement', dept:'Procurement',      al:'PROCUREMENT' },
];

(async () => {
    let ok=0, skip=0, fail=0;
    for (const u of USERS) {
        process.stdout.write('  ' + u.id.padEnd(10));
        const { data, error } = await sb.auth.admin.createUser({ email: u.email, password: u.pw, email_confirm: true });
        if (error) {
            if (error.status === 422) { console.log('SKIP (exists)'); skip++; continue; }
            console.log('FAIL: ' + error.message); fail++; continue;
        }
        console.log('OK (uid: ' + data.user.id.slice(0,8) + '...)'); ok++;
    }
    console.log('\nDone: ' + ok + ' created, ' + skip + ' skipped, ' + fail + ' failed.');
})();
