
export default function RoleSelection({role}) {
  return (
    <div style={{ position: "absolute", left: "0", top: "0", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw"}}>
        <div>
            <div style={{ textAlign: "center", marginBottom: "30px"}}><img src="/farmerIcon.png" width="300px"/></div>

            <p style={{ textAlign: "center", fontSize: "32px"}}>You are randomly selected as <span style={{ fontSize: "32px", color: "#0065ff", marginRight: "4px", marginLeft: "2px"}}>{role.replace(/.{6}/g, "$&" + " ")}</span> in your group.</p>
        </div>
    </div>
  )
}
