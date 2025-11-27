
import { Teacher } from '../../types';

// 40 Teachers: ~5-6 per grade level (PK-5) + Specials
export const MOCK_TEACHERS: Teacher[] = [
    // PK (4 Teachers)
    { id: 't_pk1', firstName: 'Sarah', lastName: 'Henson', email: 'henson.s@newton.k12.ga.us', grade: 'PK', room: 'A101', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 't_pk2', firstName: 'Rebecca', lastName: 'Tate', email: 'tate.r@newton.k12.ga.us', grade: 'PK', room: 'A102', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rebecca' },
    { id: 't_pk3', firstName: 'Maria', lastName: 'Gomez', email: 'gomez.m@newton.k12.ga.us', grade: 'PK', room: 'A103', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
    { id: 't_pk4', firstName: 'Emily', lastName: 'Stone', email: 'stone.e@newton.k12.ga.us', grade: 'PK', room: 'A104', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },

    // K (6 Teachers)
    { id: 't_k1', firstName: 'Amanda', lastName: 'Grier', email: 'grier.a@newton.k12.ga.us', grade: 'K', room: 'A105', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda' },
    { id: 't_k2', firstName: 'Latoya', lastName: 'Jackson', email: 'jackson.l@newton.k12.ga.us', grade: 'K', room: 'A106', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Latoya' },
    { id: 't_k3', firstName: 'Nancy', lastName: 'Drew', email: 'drew.n@newton.k12.ga.us', grade: 'K', room: 'A107', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nancy' },
    { id: 't_k4', firstName: 'Karen', lastName: 'Page', email: 'page.k@newton.k12.ga.us', grade: 'K', room: 'A108', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karen' },
    { id: 't_k5', firstName: 'Betty', lastName: 'White', email: 'white.b@newton.k12.ga.us', grade: 'K', room: 'A109', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Betty' },
    { id: 't_k6', firstName: 'Oprah', lastName: 'Winfrey', email: 'winfrey.o@newton.k12.ga.us', grade: 'K', room: 'A110', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oprah' },

    // 1st (6 Teachers)
    { id: 't_1st1', firstName: 'Jessica', lastName: 'Malcom', email: 'malcom.j@newton.k12.ga.us', grade: '1', room: 'B110', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
    { id: 't_1st2', firstName: 'Brittany', lastName: 'Webb', email: 'webb.b@newton.k12.ga.us', grade: '1', room: 'B112', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brittany' },
    { id: 't_1st3', firstName: 'John', lastName: 'Legend', email: 'legend.j@newton.k12.ga.us', grade: '1', room: 'B113', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { id: 't_1st4', firstName: 'Chrissy', lastName: 'Teigen', email: 'teigen.c@newton.k12.ga.us', grade: '1', room: 'B114', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chrissy' },
    { id: 't_1st5', firstName: 'Tom', lastName: 'Holland', email: 'holland.t@newton.k12.ga.us', grade: '1', room: 'B115', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom' },
    { id: 't_1st6', firstName: 'Zendaya', lastName: 'Coleman', email: 'coleman.z@newton.k12.ga.us', grade: '1', room: 'B116', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zendaya' },

    // 2nd (6 Teachers)
    { id: 't_2nd1', firstName: 'Michael', lastName: 'Ross', email: 'ross.m@newton.k12.ga.us', grade: '2', room: 'C120', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
    { id: 't_2nd2', firstName: 'Ashley', lastName: 'Simmons', email: 'simmons.a@newton.k12.ga.us', grade: '2', room: 'C122', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ashley' },
    { id: 't_2nd3', firstName: 'Dwayne', lastName: 'Johnson', email: 'johnson.d@newton.k12.ga.us', grade: '2', room: 'C123', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dwayne' },
    { id: 't_2nd4', firstName: 'Kevin', lastName: 'Hart', email: 'hart.k@newton.k12.ga.us', grade: '2', room: 'C124', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin' },
    { id: 't_2nd5', firstName: 'Jack', lastName: 'Black', email: 'black.j@newton.k12.ga.us', grade: '2', room: 'C125', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' },
    { id: 't_2nd6', firstName: 'Awkwafina', lastName: 'Lum', email: 'lum.a@newton.k12.ga.us', grade: '2', room: 'C126', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Awkwafina' },

    // 3rd (6 Teachers)
    { id: 't_3rd1', firstName: 'Christopher', lastName: 'Evans', email: 'evans.c@newton.k12.ga.us', grade: '3', room: 'D130', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
    { id: 't_3rd2', firstName: 'Emily', lastName: 'Clark', email: 'clark.e@newton.k12.ga.us', grade: '3', room: 'D132', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
    { id: 't_3rd3', firstName: 'Scarlett', lastName: 'Johansson', email: 'johansson.s@newton.k12.ga.us', grade: '3', room: 'D133', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scarlett' },
    { id: 't_3rd4', firstName: 'Robert', lastName: 'Downey', email: 'downey.r@newton.k12.ga.us', grade: '3', room: 'D134', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
    { id: 't_3rd5', firstName: 'Chris', lastName: 'Hemsworth', email: 'hemsworth.c@newton.k12.ga.us', grade: '3', room: 'D135', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hemsworth' },
    { id: 't_3rd6', firstName: 'Mark', lastName: 'Ruffalo', email: 'ruffalo.m@newton.k12.ga.us', grade: '3', room: 'D136', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark' },

    // 4th (5 Teachers)
    { id: 't_4th1', firstName: 'David', lastName: 'Wright', email: 'wright.d@newton.k12.ga.us', grade: '4', room: 'E140', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    { id: 't_4th2', firstName: 'Linda', lastName: 'Thomas', email: 'thomas.l@newton.k12.ga.us', grade: '4', room: 'E142', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda' },
    { id: 't_4th3', firstName: 'Serena', lastName: 'Williams', email: 'williams.s@newton.k12.ga.us', grade: '4', room: 'E143', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Serena' },
    { id: 't_4th4', firstName: 'Venus', lastName: 'Williams', email: 'williams.v@newton.k12.ga.us', grade: '4', room: 'E144', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Venus' },
    { id: 't_4th5', firstName: 'Simone', lastName: 'Biles', email: 'biles.s@newton.k12.ga.us', grade: '4', room: 'E145', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simone' },

    // 5th (5 Teachers)
    { id: 't_5th1', firstName: 'Robert', lastName: 'Johnson', email: 'johnson.r@newton.k12.ga.us', grade: '5', room: 'F150', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
    { id: 't_5th2', firstName: 'Michelle', lastName: 'Obama', email: 'obama.m@newton.k12.ga.us', grade: '5', room: 'F151', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle' },
    { id: 't_5th3', firstName: 'Barack', lastName: 'Obama', email: 'obama.b@newton.k12.ga.us', grade: '5', room: 'F152', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Barack' },
    { id: 't_5th4', firstName: 'Kamala', lastName: 'Harris', email: 'harris.k@newton.k12.ga.us', grade: '5', room: 'F153', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kamala' },
    { id: 't_5th5', firstName: 'Joe', lastName: 'Biden', email: 'biden.j@newton.k12.ga.us', grade: '5', room: 'F154', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joe' },

    // Specials (2 Teachers)
    { id: 't_art', firstName: 'Karen', lastName: 'Brooks', email: 'brooks.k@newton.k12.ga.us', grade: 'Art', room: 'Art Room', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karen' },
    { id: 't_pe', firstName: 'Coach', lastName: 'Sanders', email: 'sanders.c@newton.k12.ga.us', grade: 'PE', room: 'Gym', photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coach' },
];
