const POLL_SEED = {
  "god-of-war-laufey": 42,
  wolverine: 37,
  "until-dawn-2": 21,
  "control-resonant": 18,
};

const POLL_LABELS = {
  "god-of-war-laufey": "God of War Laufey",
  wolverine: "Marvel's Wolverine",
  "until-dawn-2": "Until Dawn 2",
  "control-resonant": "Control Resonant",
};

function getPollVotes(pollId) {
  try {
    return {
      ...POLL_SEED,
      ...JSON.parse(localStorage.getItem(`bluepoint:${pollId}:votes`) || "{}"),
    };
  } catch {
    return { ...POLL_SEED };
  }
}

function savePollVotes(pollId, votes) {
  localStorage.setItem(`bluepoint:${pollId}:votes`, JSON.stringify(votes));
}

function getUserVote(pollId) {
  return localStorage.getItem(`bluepoint:${pollId}:choice`);
}

function saveUserVote(pollId, choice) {
  localStorage.setItem(`bluepoint:${pollId}:choice`, choice);
}

function renderPoll(poll) {
  const pollId = poll.dataset.poll;
  const votes = getPollVotes(pollId);
  const userVote = getUserVote(pollId);
  const total = Object.values(votes).reduce((sum, value) => sum + Number(value || 0), 0);
  const buttons = [...poll.querySelectorAll("[data-poll-option]")];
  const status = poll.querySelector("[data-poll-status]");

  buttons.forEach((button) => {
    const option = button.dataset.pollOption;
    const percent = total ? Math.round(((votes[option] || 0) / total) * 100) : 0;
    button.classList.toggle("is-selected", option === userVote);
    button.style.setProperty("--poll-percent", `${percent}%`);
    button.querySelector("[data-poll-count]").textContent = `${percent}%`;
    button.setAttribute("aria-pressed", option === userVote ? "true" : "false");
  });

  if (status) {
    status.textContent = userVote
      ? `Tu voto: ${POLL_LABELS[userVote]}. Participacion actual: ${total} votos.`
      : "Vota para desbloquear los resultados.";
  }
}

function setupPoll(poll) {
  const pollId = poll.dataset.poll;
  const buttons = [...poll.querySelectorAll("[data-poll-option]")];

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextVote = button.dataset.pollOption;
      const previousVote = getUserVote(pollId);
      const votes = getPollVotes(pollId);

      if (previousVote && previousVote !== nextVote) {
        votes[previousVote] = Math.max(0, Number(votes[previousVote] || 0) - 1);
      }

      if (previousVote !== nextVote) {
        votes[nextVote] = Number(votes[nextVote] || 0) + 1;
        savePollVotes(pollId, votes);
        saveUserVote(pollId, nextVote);
      }

      renderPoll(poll);
    });
  });

  renderPoll(poll);
}

document.querySelectorAll("[data-poll]").forEach(setupPoll);
