Inittite state :
```
this.state = {isShowRow: false}
```

Bind function:
```
this.onAccordinToggle = this.onAccordinToggle.bind(this);
```
According function:
```
onAccordinToggle = () => {
    this.setState({
      isShowRow: !this.state.isShowRow,
    });
  };
```

```
<tr>
  <td onClick={this.onAccordinToggle}>RT 05 Rancaherang</td>
  <td>10</td>
  <td>10 Mpbs</td>
</tr>
{this.state.isShowRow ? (
  <tr>
    <td colSpan="3">
      <ul>
        <li> Paket internet 100 Mbps</li>
        <li> Paket internet 100 Mbps</li>
        <li> Paket internet 100 Mbps</li>
      </ul>
    </td>
  </tr>
) : null}
```
