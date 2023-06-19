import papaparse from "https://cdn.skypack.dev/papaparse@5";

async function _csvToJson(csvPath: string) {
  const csvString = await Deno.readTextFile(csvPath);

  const { data: records } = papaparse.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  const jsonData = JSON.stringify(records, null, 2)
    // This stringify converts null to "NULL"
    // and we have to convert it back to null.
    .replaceAll('"NULL"', "null");

  const jsonPath = csvPath.replace(".csv", ".json");

  await Deno.writeTextFile(jsonPath, jsonData);

  console.log(`CSV(s) converted to JSON and saved at: ${jsonPath}`);
}

const [folderPath] = Deno.args;

for await (const entry of Deno.readDir(folderPath)) {
  const filePath = `${folderPath}/${entry.name}`;

  if (entry.isFile && entry.name.endsWith(".csv")) {
    await _csvToJson(filePath);
  }
}
