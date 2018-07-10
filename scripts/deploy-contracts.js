import spawn from 'cross-spawn';
import { truffleCmd, contractsDir } from './truffle-cmd';

spawn(truffleCmd, ['deploy'], { stdio: 'inherit', cwd: contractsDir });
