async function a() {
  yield 1;
  return;
}

console.log(await a());
