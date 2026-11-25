package br.com.masyaf.games.entity;
import jakarta.persistence.*; import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity @Table(name="usuarios", uniqueConstraints={@UniqueConstraint(columnNames="email"),@UniqueConstraint(columnNames="cpf")})
public class Usuario {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=120) private String nome;
 @Column(nullable=false,length=160) private String email;
 @JsonIgnore @Column(nullable=false) private String senha;
 @Column(nullable=false,length=14) private String cpf;
 // Recuperação de senha: hash (BCrypt) do código de 6 dígitos e quando ele expira
 // Token de sessão gerado no login e enviado pelo frontend no header Authorization
 @JsonIgnore @Column(length=64) private String token;
 @JsonIgnore private String codigoRecuperacao; @JsonIgnore private java.time.LocalDateTime codigoExpiraEm;
 private String telefone; private String cep; private String rua; private String numero; private String bairro; private String cidade; private String estado;
 public Long getId(){return id;} public void setId(Long v){id=v;} public String getNome(){return nome;} public void setNome(String v){nome=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getSenha(){return senha;} public void setSenha(String v){senha=v;} public String getCpf(){return cpf;} public void setCpf(String v){cpf=v;} public String getTelefone(){return telefone;} public void setTelefone(String v){telefone=v;} public String getCep(){return cep;} public void setCep(String v){cep=v;} public String getRua(){return rua;} public void setRua(String v){rua=v;} public String getNumero(){return numero;} public void setNumero(String v){numero=v;} public String getBairro(){return bairro;} public void setBairro(String v){bairro=v;} public String getCidade(){return cidade;} public void setCidade(String v){cidade=v;} public String getEstado(){return estado;} public void setEstado(String v){estado=v;}
 public String getToken(){return token;} public void setToken(String v){token=v;}
 public String getCodigoRecuperacao(){return codigoRecuperacao;} public void setCodigoRecuperacao(String v){codigoRecuperacao=v;} public java.time.LocalDateTime getCodigoExpiraEm(){return codigoExpiraEm;} public void setCodigoExpiraEm(java.time.LocalDateTime v){codigoExpiraEm=v;}
}
