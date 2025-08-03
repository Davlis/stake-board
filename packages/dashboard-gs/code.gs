// === CONFIG ===
const API_BASE_URL = 'https://57ef97a6d43b.ngrok-free.app'; // Replace with your real backend URL
const SHEET_NAMES = {
  ODDS: 'GamesAndOdds',
  PLACE: 'PlaceBet',
  RESULTS: 'MyBets'
};

// === INIT SCRIPT ===
function createBettingDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = ss.getSheets();

  for (let i = 1; i < allSheets.length; i++) {
    ss.deleteSheet(allSheets[i]);
  }

  const oddsSheet = allSheets[0];
  oddsSheet.setName(SHEET_NAMES.ODDS);
  oddsSheet.clear();
  oddsSheet.appendRow([
    'Game ID',
    'Home Team',
    'Away Team',
    'Status',
    'Result',
    'Commence Time',
    'Bookmaker',
    'Market',
    'Last Update',
    'Outcome Name',
    'Price'
  ]);

  const placeSheet = ss.insertSheet(SHEET_NAMES.PLACE);
  placeSheet.appendRow([
    'User ID',
    'Game ID',
    'Selected Outcome',
    'Bet Amount',
    'Market',
    'Bookmaker'
  ]);

  const resultSheet = ss.insertSheet(SHEET_NAMES.RESULTS);
  resultSheet.appendRow(['User ID (edit A2 to reload):']);
  resultSheet.appendRow([''])

  [oddsSheet, placeSheet, resultSheet].forEach(sh => {
    sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold');
  });

  SpreadsheetApp.getUi().alert('Betting dashboard created!');
}

// === CUSTOM MENU ===
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🏀 Betting Menu')
    .addItem('🔄 Refresh Games & Odds', 'refreshGamesAndOdds')
    .addItem('📤 Place Bets from Sheet', 'placeBetsFromSheet')
    .addItem('📥 Load My Bets', 'loadMyBets')
    .addItem('🧼 Refresh Dashboard Layout', 'createBettingDashboard')
    .addToUi();
}

// === REFRESH ODDS FUNCTION ===
function refreshGamesAndOdds() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ODDS);
  if (!sheet) return SpreadsheetApp.getUi().alert('GamesAndOdds sheet not found');

  sheet.clear();
  sheet.appendRow([
    'Game ID',
    'Home Team',
    'Away Team',
    'Status',
    'Result',
    'Commence Time',
    'Bookmaker',
    'Market',
    'Last Update',
    'Outcome Name',
    'Price'
  ]);

  try {
    const response = UrlFetchApp.fetch(`${API_BASE_URL}/sheets/games`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': true,
      },
    })
    Logger.log(response.getContentText());
    Logger.log(response.getHeaders());

    const data = JSON.parse(response.getContentText());

    const rows = [];

    data.forEach((entry) => {
      const game = entry.game;
      const oddsArray = entry.odds;

      oddsArray.forEach((odd) => {
        odd.outcomes.forEach((outcome) => {
          rows.push([
            game.id,
            game.homeTeam,
            game.awayTeam,
            game.status,
            game.result || '',
            new Date(game.commenceTime).toLocaleString(),
            odd.bookmaker,
            odd.market,
            new Date(odd.lastUpdate).toLocaleString(),
            outcome.name,
            outcome.price
          ]);
        });
      });
    });

    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    }

    SpreadsheetApp.getUi().alert('Games & Odds updated!');
  } catch (e) {
    SpreadsheetApp.getUi().alert(`Failed to fetch games: ${e.message}`);
  }
}

// === PLACE BET FUNCTION ===
function placeBetsFromSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.PLACE);
  const data = sheet.getDataRange().getValues();
  const ui = SpreadsheetApp.getUi();

  for (let i = 1; i < data.length; i++) {
    const [userId, gameId, selectedOutcome, amount, market, bookmaker] = data[i];

    if (!userId || !gameId || !selectedOutcome || !amount || !market || !bookmaker) continue;

    const payload = {
      userId,
      gameId,
      selectedOutcome,
      amount: Number(amount),
      market,
      bookmaker,
    };

    try {
      const response = UrlFetchApp.fetch(`${API_BASE_URL}/sheets/users/${userId}/bets`, {
        method: 'post',
        contentType: 'application/json',
        headers: {
          'ngrok-skip-browser-warning': '1',
          'Accept': 'application/json',
        },
        payload: JSON.stringify(payload),
      });

      Logger.log(`Response for row ${i + 1}: ${response.getContentText()}`);
    } catch (e) {
      Logger.log(`Error placing bet on row ${i + 1}: ${e}`);
      ui.alert(`Failed to place bet on row ${i + 1}: ${e.message}`);
    }
  }

  ui.alert('Bet placement process completed. Check log for details.');
}

function loadMyBets() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.RESULTS);
  const ui = SpreadsheetApp.getUi();
  if (!sheet) return ui.alert(`"${SHEET_NAMES.RESULTS}" sheet not found`);

  const userId = sheet.getRange('A2').getValue();
  if (!userId || typeof userId !== 'string') {
    return ui.alert('Please enter a valid User ID in cell A2 of "MyBets" tab.');
  }

  sheet.clear();
  sheet.appendRow(['User ID (edit A2 to reload):']);
  sheet.appendRow([userId]);
  sheet.appendRow(['']); // spacer

  try {
    const response = UrlFetchApp.fetch(`${API_BASE_URL}/sheets/users/${userId}/bets`, {
      method: 'get',
      headers: {
        'ngrok-skip-browser-warning': '1',
        'Accept': 'application/json',
      },
    });

    const data = JSON.parse(response.getContentText());

    // Summary block
    const summaryHeaders = [
      'Total Bets',
      'Pending Bets',
      'Won Bets',
      'Lost Bets',
      'Total Wagered',
      'Total Winnings',
      'Net Profit',
    ];
    const summaryValues = [
      data.totalBets,
      data.pendingBets,
      data.wonBets,
      data.lostBets,
      data.totalWagered,
      data.totalWinnings,
      data.netProfit,
    ];
    sheet.appendRow(summaryHeaders);
    sheet.appendRow(summaryValues);
    sheet.appendRow(['']); // spacer

    // Bets list
    const betHeaders = [
      'Bet ID',
      'Game ID',
      'Selected Outcome',
      'Bookmaker',
      'Market',
      'Amount',
      'Status',
      'Potential Winnings',
    ];
    sheet.appendRow(betHeaders);

    const betRows = data.bets.map((bet) => [
      bet.id,
      bet.gameId,
      bet.selectedOutcome,
      bet.bookmaker,
      bet.market,
      bet.amount,
      bet.status,
      bet.potentialWinnings,
    ]);

    if (betRows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, betRows.length, betHeaders.length).setValues(betRows);
    }

    sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).setFontWeight('bold');

    ui.alert('User bets successfully loaded.');
  } catch (e) {
    Logger.log(e);
    ui.alert(`Failed to load user bets: ${e.message}`);
  }
}
