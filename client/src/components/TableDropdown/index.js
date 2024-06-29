import BraftEditor from 'braft-editor';
import { useState } from 'react';

const TableDropdown = (props) => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  const insertTable = () => {
    const table = [];

    for (let i = 0; i < rows; i++) {
      const row = [];

      for (let j = 0; j < columns; j++) {
        row.push('');
      }

      table.push(row);
    }

    const { editorState } = props;
    const tableContent = `<table>${table
      .map(
        (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`
      )
      .join('')}</table>`;
    const newEditorState = BraftEditor.createEditorState(
      editorState.toHTML() + tableContent
    );

    props.onChange(newEditorState);
  };

  return (
    <div className='table-dropdown-container' style={{ background: 'white' }}>
      <div className='table-input-row'>
        <label>Rows:</label>
        <input
          type='number'
          name='rows'
          value={rows}
          min={1}
          onChange={(event) => setRows(event.target.value)}
        />
      </div>
      <div className='table-input-row'>
        <label>Columns:</label>
        <input
          type='number'
          name='columns'
          value={columns}
          min={1}
          onChange={(event) => setColumns(event.target.value)}
        />
      </div>
      <div style={{display: 'flex', justifyContent: 'center', padding: '10px'}}>
        <button className='table-insert-button' onClick={insertTable}>
          Insert
        </button>
      </div>
    </div>
  );
};

export default TableDropdown;
