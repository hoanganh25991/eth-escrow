import path from 'path';
import spawn from 'cross-spawn';

const root = path.join(__dirname, '..');
const contracts = path.join(root, 'src', 'contracts');
const truffleCmd = path.join(root,'node_modules', '.bin', 'truffle');
spawn(truffleCmd, ['test'], {stdio: 'inherit', cwd: contracts});