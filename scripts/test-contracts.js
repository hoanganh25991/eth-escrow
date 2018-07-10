import spawn from 'cross-spawn';
import { truffleCmd, contractsDir } from './truffle-cmd';

spawn(truffleCmd, ['test'], { stdio: 'inherit', cwd: contractsDir });
