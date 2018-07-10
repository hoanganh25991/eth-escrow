import path from 'path';

const root = path.join(__dirname, '..');
const contractsDir = path.join(root, 'src', 'contracts');
const truffleCmd = path.join(root, 'node_modules', '.bin', 'truffle');

export { contractsDir, truffleCmd };

export default exports;
