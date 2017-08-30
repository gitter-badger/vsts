import * as util from '../outsystems-task/outsystemsreleasetaskV2//util';

console.log(util.GetNextSemVersion('0.1'));
console.log(util.GetNextSemVersion('0.1.0'));
console.log(util.GetNextSemVersion('0.0.1'));
console.log(util.GetNextSemVersion('0.2.1'));
console.log(util.GetNextSemVersion('3.2.1'));
console.log(util.GetNextSemVersion('1.2.99'));
console.log(util.GetNextSemVersion('1.2.999'));
console.log(util.GetNextSemVersion('1.999.34'));
console.log(util.GetNextSemVersion('1.999.999'));
console.log(util.GetNextSemVersion('34.999.999'));
console.log(util.GetNextSemVersion('999.999.999'));
