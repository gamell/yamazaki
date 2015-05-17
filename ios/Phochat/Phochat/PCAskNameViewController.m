//
//  PCAskNameViewController.m
//  Phochat
//
//  Created by Daniel Koh on 5/16/15.
//  Copyright (c) 2015 Carunaga. All rights reserved.
//

#import "PCAskNameViewController.h"
#import <Parse/Parse.h>
#import <MBProgressHUD/MBProgressHUD.h>

@interface PCAskNameViewController ()
@property (weak, nonatomic) IBOutlet UITextField *nameField;
@end

@implementation PCAskNameViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)doneButtonTapped:(id)sender {
    if (self.nameField.text.length > 0)
    {
        [PFUser currentUser][@"name"] = self.nameField.text;
    }
    __weak PCAskNameViewController *weakSelf = self;
    [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    [[PFUser currentUser] saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error)
    {
        [MBProgressHUD hideHUDForView:weakSelf.view animated:YES];
        [weakSelf.navigationController popViewControllerAnimated:YES];
    }];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
