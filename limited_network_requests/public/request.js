/*
Implement network requests queue with limit.
Example user needs - after a button click there should be made 100 requests to server but no
more than 5 at the same time.
Ability to pass highest priority request (unshift).
*/

const buttonSend = document.querySelector("[id='send']");
const buttonSendPriority = document.querySelector("[id='send_priority']");

const createSemaphore = (maxReq) => {
  const fnsToResolve = [];
  let activeRuns = 0;

  const done = () => {
    activeRuns -= 1;
    run();
  };

  const run = () => {
    if (activeRuns === maxReq || fnsToResolve.length === 0) return;
    const fn = fnsToResolve.shift();
    activeRuns += 1;
    fn(done);
  };

  return {
    take: (fn) => {
      fnsToResolve.push(fn);
      run();
    },
    takeHighPriority: (fn) => {
      fnsToResolve.unshift(fn);
    },
  };
};

const sem = createSemaphore(5);

const createRequestFn = (priority, id) => {
  function requestFn(done) {
    $("#list").append(
      `<li id="${id}">Request #${id} status: fetching; Priority: ${priority}</li>`
    );
    fetch("/api/get").then(function () {
      $(`#${id}`).replaceWith(
        `<li id="${id}">Request #${id} status: Done! Priority: ${priority}</li>`
      );
      done();
    });
  };
  return requestFn;
};

buttonSend.addEventListener("click", function () {
  for (let i = 0; i < 100; i++) {
    const fn = createRequestFn("low", i);
    sem.take(fn);
  }
});
buttonSendPriority.addEventListener("click", function () {
  sem.takeHighPriority(createRequestFn("high",Math.floor(Math.random() * 1000)));
});
