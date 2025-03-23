import javax.xml.transform.stream.StreamSource;

public class butterful {
    public static void main(String args[]){
        int n=5;
        for(int i=0;i<n;i++){
            for(int j=0;j<=i;j++){
                System.out.print("*");
            }
            int spaces = 2*(n-i);
            for(int j=0;j<=spaces;j++){
                System.out.print(" ");
            }
            for(int j=0;j<=i;j++){
                System.out.print("*");
            }
            System.out.println();
        }

        for(int i=n;i>=0;i--){
            for(int j=0;j<=i;j++){
                System.out.print("*");
            }
            int spaces = 2*(n-i);
            for(int j=0;j<=spaces;j++){
                System.out.print(" ");
            }
            for(int j=0;j<=i;j++){
                System.out.print("*");
            }
            System.out.println();
            
        }
        // int n=5;
        // for(int i=1;i<=n;i++){
        //     for(int j=1;j<=n-i;j++){
        //         System.out.print(" ");
        //     }
        //     for(int j=1;j<=i;j++){
        //         System.out.print(i+" ");
        //     }
        //     System.out.println();
        // }
        
    }
    
}
